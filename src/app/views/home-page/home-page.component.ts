import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpcomingEventsCarouselComponent } from '../../components/upcoming-events-carousel/upcoming-events-carousel.component';
import { ScrollNearEndDirective } from '../../utils/scroll-near-end.directive';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    AsyncPipe,
    EventCardComponent,
    TranslocoPipe,
    UpcomingEventsCarouselComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;
  hasMoreEvents$!: Observable<boolean>;
  isLoading: boolean = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getFyEvents().pipe(
      map(data => data.events),
      tap(() => (this.isLoading = false)),
    );
    this.hasMoreEvents$ = this.eventService
      .getFyEvents()
      .pipe(map(data => data.hasMore));
  }

  loadNewPage(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.eventService.loadNextFyPage();
  }
}
