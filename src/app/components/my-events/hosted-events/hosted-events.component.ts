import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {EventCardItem} from '../../../interfaces/EventCardItem';
import {EventService} from '../../../services/event/eventservice';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {EventCardComponent} from '../../event-card/event-card.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {AsyncPipe} from '@angular/common';

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
export class HostedEventsComponent implements OnInit{
  events$!: Observable<EventCardItem[]>;
  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.getHostedEvents();
  }

  getHostedEvents(): void {
    this.events$ = this.eventService.getHostingEvents();
  }

}
