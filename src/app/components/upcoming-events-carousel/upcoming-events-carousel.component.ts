import { Component, HostListener, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { CarouselModule } from 'primeng/carousel';
import { EventService } from '../../services/event/eventservice';
import { EventCardComponent } from '../event-card/event-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError } from 'rxjs/operators';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-upcomming-events-carousel',
  standalone: true,
  imports: [
    AsyncPipe,
    CarouselModule,
    EventCardComponent,
    TranslocoPipe,
    SkeletonModule,
  ],
  templateUrl: './upcoming-events-carousel.component.html',
})
export class UpcomingEventsCarouselComponent implements OnInit {
  innerWidth: number = 0;
  events$!: Observable<EventCardItem[]>;
  responsiveOptions: any[] | undefined;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events$ = this.eventService.getUpcomingEvents().pipe(
      catchError((error: Error) => {
        console.log('waaaa', error);
        return of([]);
      }),
    );

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

  calculateAutoplayInterval(windowWidth: number, eventCount: number) {
    const moreThanOneEvent = eventCount > 1;
    const smallScreen = windowWidth <= 767;
    if (moreThanOneEvent || smallScreen) {
      return 3700;
    }
    return 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
}
