import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { LoginComponent } from '../../components/login/login.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Observable, tap } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { EventService } from '../../services/event/eventservice';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../components/register/register.component';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { ScrollNearEndDirective } from '../../utils/scroll-near-end.directive';
import { map } from 'rxjs/operators';

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
    MenuModule,
    SidebarModule,
    ScrollNearEndDirective,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  events$!: Observable<EventCardItem[]>;
  hasMoreEvents$!: Observable<boolean>;

  switch: boolean = false;
  isLoading: boolean = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getAllEvents().pipe(
      map(data => data.events),
      tap(() => (this.isLoading = false)),
    );
    this.hasMoreEvents$ = this.eventService
      .getAllEvents()
      .pipe(map(data => data.hasMore));
  }

  loadNewPage(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.eventService.loadNextAllEventsPage();
  }

  toggleSwitch(): void {
    this.switch = !this.switch;
  }
}
