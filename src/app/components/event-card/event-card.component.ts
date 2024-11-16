import { booleanAttribute, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { DatePipe } from '@angular/common';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    TagModule,
    AngularRemixIconComponent,
    SkeletonModule,
    DatePipe,
    TranslocoDatePipe,
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
  @Input() event!: EventCardItem;

  constructor() {}

  /**
   * Accepts an ISO-Date-String
   * @param date ISO-Date
   */
  toDate(date: string): Date {
    return new Date(date);
  }

  toImageUrl(url: string | undefined | null): string {
    if (url) {
      return `url('images/${url}')`;
    }
    return "url('https://placehold.co/600x400')";
  }
}
