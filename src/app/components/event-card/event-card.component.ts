import { booleanAttribute, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { RouterLink } from '@angular/router';
import { StatusEnum } from '../../interfaces/StatusEnum';
import {
  DockPosition,
  EventStatusIndicatorComponent,
} from '../event-status-indicator/event-status-indicator.component';
import { EventStatusService } from '../../services/event/event-status.service';
import { EventService } from '../../services/event/eventservice';
import { BadgeModule } from 'primeng/badge';

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
    EventStatusIndicatorComponent,
    BadgeModule,
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
  @Input() event!: EventCardItem;

  @Input({ transform: booleanAttribute }) showEventStatus: boolean = false;
  @Input({ transform: booleanAttribute }) compact: boolean = false;
  @Input() badge: number | undefined;

  constructor(
    private eventStatus: EventStatusService,
    protected eventService: EventService,
  ) {}

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

  getStatusColor(eventStatus: StatusEnum): string {
    return this.eventStatus.getStatusColor(eventStatus);
  }

  protected readonly DockPosition = DockPosition;
}
