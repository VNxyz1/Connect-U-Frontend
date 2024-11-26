import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { LoginComponent } from '../../components/login/login.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../components/register/register.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    ImageModule,
    LoginComponent,
    TranslocoPipe,
    AsyncPipe,
    EventCardComponent,
    RouterOutlet,
    RegisterComponent,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;
  switch: boolean = false;
  constructor(private eventService: EventService) {}

  async ngOnInit(): Promise<void> {
    this.getEvents();
  }

  getEvents() {
    this.events$ = this.eventService.getAllEvents();
  }
  toggleSwitch(): void {
    this.switch = !this.switch;
  }
}
