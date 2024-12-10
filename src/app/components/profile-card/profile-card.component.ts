import { Component, Input } from '@angular/core';
import { ProfileData } from '../../interfaces/ProfileData';
import { CardModule } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CardModule,
    NgOptimizedImage,
    RouterLink,
    AngularRemixIconComponent,
  ],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  @Input() userProfile!: ProfileData;
  @Input() showAge: boolean = false;
}
