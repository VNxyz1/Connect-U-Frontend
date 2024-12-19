import { Component } from '@angular/core';
import { QrCodeAndLinkComponent } from '../../components/qr-code-and-link/qr-code-and-link.component';

@Component({
  selector: 'app-share-profile',
  standalone: true,
  imports: [QrCodeAndLinkComponent],
  templateUrl: './share-profile-page.component.html',
})
export class ShareProfilePageComponent {}
