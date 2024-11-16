import { booleanAttribute, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    TagModule,
    AngularRemixIconComponent,
    SkeletonModule,
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
}
