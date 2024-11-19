import {Component, OnInit} from '@angular/core';
import { ImageModule } from 'primeng/image';
import { LoginComponent } from '../../components/login/login.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {AsyncPipe} from "@angular/common";
import {EventCardComponent} from "../../components/event-card/event-card.component";
import {Observable} from 'rxjs';
import {EventCardItem} from '../../interfaces/EventCardItem';
import {EventService} from '../../services/event/eventservice';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ImageModule, LoginComponent, TranslocoPipe, AsyncPipe, EventCardComponent],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService, protected auth: AuthService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.events$ = this.eventService.getAllEvents();
  }
}
