import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamModule } from 'ngx-webcam';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [WebcamModule, TranslocoPipe, CardModule, SkeletonModule],
  templateUrl: './camera.component.html',
})
export class CameraComponent implements OnInit {
  private qrCodeReader: BrowserQRCodeReader | null = null;
  private controls: IScannerControls | null = null;
  protected qrResult: string | null = null;
  protected allowCameraSwitching = false;
  protected loading: boolean = true;

  constructor(
    private readonly messageService: MessageService,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.startQrCodeScanner();
  }

  private async startQrCodeScanner(): Promise<void> {
    this.qrCodeReader = new BrowserQRCodeReader();

    try {
      const videoInputDevices =
        await BrowserQRCodeReader.listVideoInputDevices();

      // Attempt to find a back camera
      const backCamera = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back'),
      );
      const selectedCamera = backCamera || videoInputDevices[0]; // Use the first device if no back camera is found

      if (!selectedCamera) {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'cameraComponent.message.no-camera-detected-title',
          ),
          detail: this.translocoService.translate(
            'cameraComponent.message.no-camera-detected-detail',
          ),
        });
        return;
      }
      const videoElement = document.getElementById('video') as HTMLVideoElement;

      if (videoElement) {
        // Start the selected camera
        this.controls = await this.qrCodeReader.decodeFromVideoDevice(
          selectedCamera.deviceId,
          videoElement,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              console.log('QR Code detected:', scannedText);

              if (this.isValidQrCode(scannedText)) {
                this.qrResult = scannedText;
                this.controls?.stop(); // Stop scanning after detecting a valid QR code
                this.navigateToLink(this.qrResult);
              } else {
                this.qrResult = null; // Invalidate the result if it's not valid
                this.messageService.add({
                  severity: 'warn',
                  summary: this.translocoService.translate(
                    'cameraComponent.message.invalid-qr-code-title',
                  ),
                  detail: this.translocoService.translate(
                    'cameraComponent.message.invalid-qr-code-detail',
                  ),
                });
              }
            }
          },
        );
        this.loading = false;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: this.translocoService.translate(
            'cameraComponent.message.initialization-error-title',
          ),
          detail: this.translocoService.translate(
            'cameraComponent.message.initialization-error-detail',
          ),
        });
      }

      // Allow camera switching only if there is no back camera
      if (!backCamera && videoInputDevices.length > 1) {
        this.allowCameraSwitching = true;
        this.setupCameraSwitching(
          videoInputDevices as MediaDeviceInfo[],
          videoElement,
        );
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translocoService.translate(
          'cameraComponent.message.initialization-error-title',
        ),
        detail: this.translocoService.translate(
          'cameraComponent.message.initialization-error-detail',
        ),
      });
    }
  }

  private isValidQrCode(scannedText: string): boolean {
    const currentDomain = globalThis.location.origin; // Current domain
    const normalizedScannedText = scannedText.trim().toLowerCase(); // Normalize case and whitespace

    // Check if the scanned text starts with the current domain and includes '/add-friend/'
    return (
      normalizedScannedText.startsWith(currentDomain.toLowerCase()) &&
      normalizedScannedText.includes('/add-friend/')
    );
  }

  protected navigateToLink(qrResult: string): void {
    // Get the current domain without protocol
    const currentDomain = globalThis.location.origin;
    console.log('Current Domain:', currentDomain);
    console.log('QR Result:', qrResult);

    // Validate if the QR result matches the current domain and includes the 'add-friend' path
    if (
      qrResult.startsWith(currentDomain) &&
      qrResult.includes('/add-friend/')
    ) {
      // Remove the domain from the QR result to extract the relative path
      const path = qrResult.replace(/^https?:\/\/[^/]+/, '');
      console.log('Extracted Path:', path);

      // Split the path into segments and filter out empty parts
      const pathSegments = path.split('/').filter(Boolean);

      // Find the index of 'add-friend' and get all segments starting from it
      const addFriendIndex = pathSegments.indexOf('add-friend');
      const filteredPathSegments =
        addFriendIndex !== -1 ? pathSegments.slice(addFriendIndex) : [];

      // If valid path segments are found, navigate to the target route
      if (filteredPathSegments.length > 0) {
        this.router.navigate(filteredPathSegments).catch(error => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'cameraComponent.message.navigation-error-title',
            ),
            detail: this.translocoService.translate(
              'cameraComponent.message.navigation-error-detail',
            ),
          });
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: this.translocoService.translate(
            'cameraComponent.message.invalid-qr-code-title',
          ),
          detail: this.translocoService.translate(
            'cameraComponent.message.invalid-qr-code-detail',
          ),
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate(
          'cameraComponent.message.invalid-qr-code-title',
        ),
        detail: this.translocoService.translate(
          'cameraComponent.message.invalid-qr-code-detail',
        ),
      });
    }
  }

  private setupCameraSwitching(
    devices: MediaDeviceInfo[],
    videoElement: HTMLVideoElement,
  ): void {
    let currentIndex = 0; // Track the current camera index

    document
      .getElementById('switchCameraButton')
      ?.addEventListener('click', async () => {
        // Stop the current camera
        this.controls?.stop();

        // Move to the next camera
        currentIndex = (currentIndex + 1) % devices.length;
        const nextCamera = devices[currentIndex];

        // Start the next camera
        this.controls = await this.qrCodeReader!.decodeFromVideoDevice(
          nextCamera.deviceId,
          videoElement,
          (result, error) => {
            if (result) {
              this.qrResult = result.getText();
              this.controls?.stop(); // Stop scanning after detecting a QR code
            }
            if (error) {
              this.messageService.add({
                severity: 'error',
                summary: this.translocoService.translate(
                  'cameraComponent.message.qr-scan-error-title',
                ),
                detail: this.translocoService.translate(
                  'cameraComponent.message.qr-scan-error-detail',
                ),
              });
            }
          },
        );
      });
  }

  protected handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError?.name === 'NotAllowedError') {
      this.messageService.add({
        severity: 'info',
        summary: this.translocoService.translate(
          'cameraComponent.message.access-denied-title',
        ),
        detail: this.translocoService.translate(
          'cameraComponent.message.access-denied-detail',
        ),
      });
    }
  }

  ngOnDestroy(): void {
    this.controls?.stop(); // Ensure the scanner is stopped when the component is destroyed
  }
}
