import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpcomingEventsCarouselComponent } from '../../components/upcoming-events-carousel/upcoming-events-carousel.component';
import {ScrollNearEndDirective} from '../../utils/scroll-near-end.directive';

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

  constructor(private eventService: EventService) {}

  async ngOnInit(): Promise<void> {
    this.getEvents();
  }

  getEvents() {
    this.events$ = this.eventService.getFyEvents();
  }

  loadNewPage(): void {
    this.eventService.loadNextPage();
  }


}
