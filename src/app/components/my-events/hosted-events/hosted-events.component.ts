import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, finalize, Observable, tap} from 'rxjs';
import {EventCardItem} from '../../../interfaces/EventCardItem';
import {EventService} from '../../../services/event/eventservice';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {EventCardComponent} from '../../event-card/event-card.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {AsyncPipe} from '@angular/common';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-hosted-events',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    EventCardComponent,
    TranslocoPipe,
    AsyncPipe
  ],
  templateUrl: './hosted-events.component.html',
})
export class HostedEventsComponent implements OnInit,OnChanges{
  @Input() filters: {name: string}[] = [];
  events$!: Observable<EventCardItem[]>;
  filteredEvents$!: Observable<EventCardItem[]>;
  @Output() hasEventsChange = new EventEmitter<boolean>();
  protected isLoading = true;
  private filtersSubject = new BehaviorSubject<{ name: string }[]>([]);

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.events$ = this.eventService.getHostingEvents().pipe(
      tap(()=>{
        this.isLoading = true;
      }),
      tap((events) => {
        this.hasEventsChange.emit(events.length > 0);
      }),
      finalize(()=>{
        this.isLoading = false;
      })
    );
    this.filteredEvents$ = this.filtersSubject.pipe(
      switchMap(filters =>
        this.events$.pipe(
          map(events =>
            filters.length > 0
              ? events.filter(event =>
                event.categories.some(category =>
                  filters.map(filter => filter.name).includes(category.name)
                )
              )
              : events
          )
        )
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.filtersSubject.next(this.filters);
    }
  }
}
