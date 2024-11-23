import {Component, OnInit} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {AsyncPipe, NgClass} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {EventService} from '../../services/event/eventservice';
import { of, Subscription, timeout} from 'rxjs';
import {EventCardItem} from '../../interfaces/EventCardItem';
import {EventCardComponent} from '../../components/event-card/event-card.component';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [
    TabViewModule,
    NgClass,
    ButtonDirective,
    EventCardComponent,
    AsyncPipe,
    AngularRemixIconComponent,
    TranslocoPipe
  ],
  templateUrl: './my-events-page.component.html',
})
export class MyEventsPageComponent implements OnInit {
  activeTab: string = 'gast';
  events: EventCardItem[] = [];
  loading: boolean = false;

  private subscriptions: Subscription = new Subscription()

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.fetchEvents();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    let fetchObservable;

    switch (this.activeTab) {
      case 'gast':
        fetchObservable = this.eventService.getParticipatingEvents().pipe(
          timeout(5000),
          catchError(() => of([]))
        );
        break;
      case 'erstellt':
        fetchObservable = this.eventService.getHostingEvents().pipe(
          timeout(5000),
          catchError(() => of([]))
        );
        break;
      case 'favorisiert':
        // to do fetchObservable = this.eventService.getFavoriteEvents();
        break;
      default:
        fetchObservable = this.eventService.getParticipatingEvents();
    }

    if (fetchObservable) {
      const subscription = fetchObservable.subscribe({
        next: events => {
          this.events = events;
          this.loading = false;
        },
        error: () => {
          this.events = [];
          this.loading = false;
        },
      });
      this.subscriptions.add(subscription);
    } else {
      this.events = [];
      this.loading = false;
    }
  }

}
