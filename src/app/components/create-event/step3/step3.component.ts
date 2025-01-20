import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event/eventservice';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NgClass } from '@angular/common';
import { EventData } from '../../../services/event/eventservice';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    SliderModule,
    NgClass,
    TranslocoPipe,
    MultiSelectModule,
  ],
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  title: string | undefined;
  participantsNumber: number | undefined;
  genders: { label: string; value: number }[] = [];
  preferredGenders: number[] = [];
  ageValues: (number | undefined)[] = [16, 99];
  private ageChangeSubject = new Subject<{ index: number; value: number }>();
  submitted: boolean = false;
  eventImage: File | null = null;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private translocoService: TranslocoService,
  ) {
    this.ageChangeSubject
      .pipe(debounceTime(300))
      .subscribe(({ index, value }) => {
        this.applyAgeChange(index, value);
      });
  }

  async ngOnInit() {
    this.ageChangeSubject
      .pipe(debounceTime(300))
      .subscribe(({ index, value }) => {
        this.applyAgeChange(index, value);
      });

    await this.loadGenders();
    await this.insertValuesAgain();
    await this.loadImageFromStorage();
  }

  async loadImageFromStorage(): Promise<void> {
    try {
      const storedBase64Image = await this.eventService.getEventImage(); // Aus StorageService laden
      if (storedBase64Image) {
        this.eventImage = await this.base64ToFile(
          storedBase64Image,
          'eventImage.jpg',
        );
        console.log('Event image loaded:', this.eventImage);
      }
    } catch (error) {
      console.error('Error loading event image:', error);
    }
  }

  private async loadGenders() {
    this.eventService
      .getGenders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.genders = data.map(gender => {
            let label = '';
            switch (gender.gender) {
              case 1:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.male',
                );
                break;
              case 2:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.female',
                );
                break;
              case 3:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.divers',
                );
                break;
            }
            return { label, value: gender.id };
          });
        },
        error: error => console.error('Error loading genders:', error),
      });
  }

  private async insertValuesAgain() {
    const step3Data = await this.eventService.getEventCreateInformation();
    this.title = step3Data.title || '';
    this.participantsNumber = step3Data.participantsNumber || 2;
    this.preferredGenders = step3Data.preferredGenders || [];
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  protected getMaxAgePlaceholder(): string {
    return this.translocoService.translate(
      'createEventStep3Component.ageSection.maxAgePlaceholder',
    );
  }

  protected onSliderChange(event: (number | undefined)[]): void {
    this.ageValues = [...event];
  }

  protected onAgeChange(
    index: number,
    value: string | number,
    event?: KeyboardEvent,
  ): void {
    const valueString = value.toString();
    if (
      event?.key === 'Backspace' ||
      event?.key === 'Delete' ||
      valueString.length < 2
    ) {
      if (value === '') {
        this.ageValues[index] = undefined;
      }
      return;
    }

    if (value === '') {
      this.ageValues[index] = undefined;
      return;
    }

    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      return;
    }

    this.ageValues[index] = numericValue;

    this.ageChangeSubject.next({ index, value: numericValue });
  }

  protected onAgeBlur(index: number): void {
    const currentValue: number | string | undefined = this.ageValues[index];

    if (currentValue === undefined || currentValue === null) {
      this.ageValues[index] = index === 0 ? 16 : 99;
    } else {
      const numericValue = Number(currentValue);

      if (!isNaN(numericValue)) {
        if (index === 0) {
          this.ageValues[0] = Math.max(
            16,
            Math.min(numericValue, this.ageValues[1] ?? 99),
          );
        } else if (index === 1) {
          this.ageValues[1] = Math.min(
            99,
            Math.max(numericValue, this.ageValues[0] ?? 16),
          );
        }

        if (
          this.ageValues[0] !== undefined &&
          this.ageValues[1] !== undefined &&
          this.ageValues[0] > this.ageValues[1]
        ) {
          this.ageValues[1] = this.ageValues[0];
        }
      }
    }

    this.onSliderChange([...this.ageValues]);
  }

  private applyAgeChange(index: number, value: number): void {
    const stringValue = value.toString();

    if (stringValue === '') {
      this.ageValues[index] = undefined;
      return;
    }

    if (index === 0) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) return;

      this.ageValues[0] = Math.max(
        0,
        Math.min(numericValue, <number>this.ageValues[1]),
      );
    } else if (index === 1) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) return;

      this.ageValues[1] = Math.min(
        99,
        Math.max(numericValue, <number>this.ageValues[0]),
      );
    }

    if (
      this.ageValues[0] &&
      this.ageValues[1] &&
      this.ageValues[0] > this.ageValues[1]
    ) {
      this.ageValues[1] = this.ageValues[0];
    }
  }

  protected complete() {
    this.submitted = true;

    if (
      this.ageValues[0] &&
      this.ageValues[1] &&
      (!this.participantsNumber ||
        this.participantsNumber < 2 ||
        this.ageValues[0] < 16 ||
        this.ageValues[1] > 99 ||
        this.ageValues[0] > this.ageValues[1])
    ) {
      return;
    }

    this.sendEventInformation();

    this.eventService.postEvent().subscribe({
      next: (response: any) => {
        const eventId = response?.eventId;

        if (eventId) {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'createEventStep3Component.messages.eventCreatedSuccess',
              { title: this.title },
            ),
          });
          if (this.eventImage) {
            const formData = new FormData();
            formData.append('file', this.eventImage);

            this.eventService.postEventImage(eventId, formData).subscribe({
              next: data => console.log(data),
            });
            this.eventService.removeEventImage().then(r => {
              console.log(r);
              this.navigateToEvent(eventId);
            });
          } else {
            this.navigateToEvent(eventId);
          }
        } else {
          throw new Error(
            this.translocoService.translate(
              'createEventStep3Component.messages.noEventIdError',
            ),
          );
        }
      },
      error: error => {
        console.error('Error posting event:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'createEventStep3Component.messages.eventCreatedError',
          ),
          detail: this.translocoService.translate(
            'createEventStep3Component.messages.eventCreatedErrorMessage',
          ),
        });
        return;
      },
    });
  }

  private navigateToEvent(eventId: string): void {
    setTimeout(() => {
      this.router.navigate(['/event', eventId], {
        relativeTo: this.route,
        queryParams: { fromCreate: true },
      });
    }, 2000);
  }

  protected prevPage() {
    this.sendEventInformation();
    this.router
      .navigate(['../step2'], { relativeTo: this.route })
      .then(() => {})
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private async sendEventInformation() {
    const data: Partial<EventData> = {
      participantsNumber: this.participantsNumber,
      preferredGenders: this.preferredGenders,
    };

    if (this.ageValues[0] !== 16) {
      data.startAge = this.ageValues[0];
    }

    if (this.ageValues[1] !== 99) {
      data.endAge = this.ageValues[1];
    }

    await this.eventService.setEventInformation(data);
  }

  protected readonly KeyboardEvent = KeyboardEvent;
  private base64ToFile(base64: string, fileName: string): File {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const byteNumbers = new Array(byteString.length)
      .fill(0)
      .map((_, i) => byteString.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
  }
}
