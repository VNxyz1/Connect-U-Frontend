import {Component, OnInit} from '@angular/core';
import {EventCardItem} from '../../../interfaces/EventCardItem';
import {Observable} from 'rxjs';
import {EventService} from '../../../services/event/eventservice';
import {AsyncPipe} from '@angular/common';
import {EventCardComponent} from '../../event-card/event-card.component';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-guest-events',
  standalone: true,
  imports: [
    AsyncPipe,
    EventCardComponent,
    TranslocoPipe
  ],
  templateUrl: './guest-events.component.html'
})
export class GuestEventsComponent implements OnInit{
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.getGuestEvents();
  }

  getGuestEvents(): void {
    this.events$ = this.eventService.getParticipatingEvents();
  }
}
