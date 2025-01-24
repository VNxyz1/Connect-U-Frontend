import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { EventCardItem } from '../../../interfaces/EventCardItem';
import { EventService } from '../../../services/event/eventservice';
import { EventCardComponent } from '../../event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';
import { BadgeModule } from 'primeng/badge';
import { StatusEnum } from '../../../interfaces/StatusEnum';

@Component({
  selector: 'app-hosted-events',
  standalone: true,
  imports: [
    EventCardComponent,
    TranslocoPipe,
    AsyncPipe,
    BadgeModule,
  ],
  templateUrl: './hosted-events.component.html',
})
export class HostedEventsComponent implements OnInit, OnChanges {
  @Input() filters: { name: string }[] = [];
  events$!: Observable<EventCardItem[]>;
  notFinishedEvents$!: Observable<EventCardItem[]>;
  finishedEvents$!: Observable<EventCardItem[]>;
  pushNotifications!: Observable<Map<string, number>>;
  @Output() hasEventsChange = new EventEmitter<boolean>();
  protected isLoading = true;
  private filtersSubject = new BehaviorSubject<{ name: string }[]>([]);

  constructor(
    private eventService: EventService,
    private pushNotificationService: PushNotificationService,
  ) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getHostingEvents().pipe(
      tap(() => {
        this.isLoading = true;
      }),
      tap(events => {
        this.hasEventsChange.emit(events.length > 0);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
    );

    this.notFinishedEvents$ = this.filtersSubject.pipe(
      switchMap(filters =>
        this.events$.pipe(
          map(events =>
            events.filter(
              event =>
                !this.isEventFinished(event) &&
                this.matchesFilters(event, filters),
            ),
          ),
        ),
      ),
    );

    this.finishedEvents$ = this.filtersSubject.pipe(
      switchMap(filters =>
        this.events$.pipe(
          map(events =>
            events.filter(
              event =>
                this.isEventFinished(event) &&
                this.matchesFilters(event, filters),
            ),
          ),
        ),
      ),
    );

    this.pushNotifications = this.pushNotificationService.getHostedEventsList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.filtersSubject.next(this.filters);
    }
  }

  private isEventFinished(event: EventCardItem): boolean {
    return event.status === StatusEnum.finished;
  }

  private matchesFilters(
    event: EventCardItem,
    filters: { name: string }[],
  ): boolean {
    return (
      filters.length === 0 ||
      event.categories.some(category =>
        filters.map(filter => filter.name).includes(category.name),
      )
    );
  }
}
