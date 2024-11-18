import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AsyncPipe, EventCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.events$ = this.eventService.getAllEvents();
  }
}
