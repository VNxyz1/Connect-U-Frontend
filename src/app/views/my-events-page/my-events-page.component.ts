import {Component, OnInit} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {AsyncPipe, NgClass} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {EventService} from '../../services/event/eventservice';
import {Observable} from 'rxjs';
import {EventCardItem} from '../../interfaces/EventCardItem';
import {EventCardComponent} from '../../components/event-card/event-card.component';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';

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
  events$!: Observable<EventCardItem[]>;

  constructor(private eventService: EventService, private translocoService:TranslocoService) {}

  ngOnInit() {
    this.fetchEvents();
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.fetchEvents();
  }
  fetchEvents(): void {
    switch (this.activeTab) {
      case 'gast':
        this.events$ = this.eventService.getParticipatingEvents();
        break;
      case 'erstellt':
        this.events$ = this.eventService.getHostingEvents();
        break;
      case 'favorisiert':
        //not implemented
        //this.events$ = this.eventService.getFavoriteEvents();
        break;
      default:
        this.events$ = this.eventService.getParticipatingEvents();
    }
  }

}
