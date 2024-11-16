import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [EventCardComponent, AsyncPipe],
  providers: [MessageService],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.events$ = this.eventService.getAllEvents();
  }
}
