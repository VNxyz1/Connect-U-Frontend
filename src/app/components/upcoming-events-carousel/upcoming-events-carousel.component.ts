import { Component, HostListener, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { CarouselModule } from 'primeng/carousel';
import { EventService } from '../../services/event/eventservice';
import { Button } from 'primeng/button';
import { EventCardComponent } from '../event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-upcomming-events-carousel',
  standalone: true,
  imports: [
    AsyncPipe,
    CarouselModule,
    Button,
    EventCardComponent,
    TranslocoPipe,
  ],
  templateUrl: './upcoming-events-carousel.component.html',
})
export class UpcomingEventsCarouselComponent implements OnInit {
  innerWidth: number = 0;
  events$!: Observable<EventCardItem[]>;
  responsiveOptions: any[] | undefined;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events$ = this.eventService.getParticipatingEvents();

    this.innerWidth = window.innerWidth;

    this.responsiveOptions = [
      {
        breakpoint: '1599px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1099px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '576px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
}
