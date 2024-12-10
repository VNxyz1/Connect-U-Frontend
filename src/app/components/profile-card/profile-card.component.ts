import { booleanAttribute, Component, Input } from '@angular/core';
import { ProfileData } from '../../interfaces/ProfileData';
import { CardModule } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CardModule,
    NgOptimizedImage,
    RouterLink,
    AngularRemixIconComponent,
    SkeletonModule,
  ],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  @Input() userProfile!: ProfileData;
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
}
