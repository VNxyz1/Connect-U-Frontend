import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventCardItem } from '../../../interfaces/EventCardItem';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { EventService } from '../../../services/event/eventservice';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../../event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { map, switchMap } from 'rxjs/operators';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventRequestService } from '../../../services/event/event-request/event-request.service';

@Component({
  selector: 'app-guest-events',
  standalone: true,
  imports: [AsyncPipe, EventCardComponent, TranslocoPipe, AngularRemixIconComponent, CardModule, RouterLink],
  templateUrl: './guest-events.component.html',
})
export class GuestEventsComponent implements OnInit, OnChanges {
  @Input() filters: { name: string }[] = [];
  events$!: Observable<EventCardItem[]>;
  filteredEvents$!: Observable<EventCardItem[]>;
  protected isLoading = true;
  @Output() hasEventsChange = new EventEmitter<boolean>();
  @Input() hasRequests!: boolean;
  currentUrl: string = '';

  private filtersSubject = new BehaviorSubject<{ name: string }[]>([]);

  constructor(private readonly eventService: EventService,
              private router: Router,
              protected readonly route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
    this.events$ = this.eventService.getParticipatingEvents().pipe(
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
    this.filteredEvents$ = this.filtersSubject.pipe(
      switchMap(filters =>
        this.events$.pipe(
          map(events =>
            filters.length > 0
              ? events.filter(event =>
                  event.categories.some(category =>
                    filters.map(filter => filter.name).includes(category.name),
                  ),
                )
              : events,
          ),
        ),
      ),
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.filtersSubject.next(this.filters);
    }
  }
}
