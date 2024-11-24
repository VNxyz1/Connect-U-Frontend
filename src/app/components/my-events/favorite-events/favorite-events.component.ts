import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {EventCardItem} from '../../../interfaces/EventCardItem';
import {EventService} from '../../../services/event/eventservice';
import {EventCardComponent} from '../../event-card/event-card.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-favorite-events',
  standalone: true,
  imports: [
    EventCardComponent,
    TranslocoPipe,
    AsyncPipe
  ],
  templateUrl: './favorite-events.component.html',
})
export class FavoriteEventsComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    //to implement
  }

  getFavoriteEvents(){
    //this.events$ = this.eventService.getFavoriteEvents();
  }
}
