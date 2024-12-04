import { booleanAttribute, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { StatusEnum } from '../../interfaces/StatusEnum';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    TagModule,
    AngularRemixIconComponent,
    SkeletonModule,
    TranslocoDatePipe,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
  @Input() event!: EventCardItem;

  @Input({ transform: booleanAttribute }) showEventStatus: boolean = false;

  // placeholder
  ahhArr: string[] = [
    'Placeholder',
    'cause_missing_in_Backend',
    'sdadsaddasddsdasdasdasd',
    'asdsadasd',
    'asdsadasd',
    'asdsadasd',
    'asdsadasd',
    'asdsadasd',
  ].slice(0, Math.floor(Math.random() * (7 - 1 + 1) + 1));

  constructor() {}

  /**
   * Accepts an ISO-Date-String
   * @param date ISO-Date
   */
  toDate(date: string): Date {
    return new Date(date);
  }

  toImageUrl(url: string | undefined | null): string {
    if (url && url.trim().length > 0) {
      return `url('/images/${url}')`;
    }
    return "url('/images/empty.png')";
  }

  getCardBorderColor(eventStatus: StatusEnum): string {
    switch (eventStatus) {
      case StatusEnum.live:
        return 'border-red-900';
      case StatusEnum.cancelled:
      case StatusEnum.finished:
        return 'border-gray-900';
      case StatusEnum.upcoming:
        return 'border-orange-900';
    }
  }

  protected readonly StatusEnum = StatusEnum;
}
