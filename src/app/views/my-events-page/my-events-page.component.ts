import {Component} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {AsyncPipe, NgClass} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {EventCardComponent} from '../../components/event-card/event-card.component';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {TranslocoPipe} from '@jsverse/transloco';
import {GuestEventsComponent} from '../../components/my-events/guest-events/guest-events.component';
import {HostedEventsComponent} from '../../components/my-events/hosted-events/hosted-events.component';
import {FavoriteEventsComponent} from '../../components/my-events/favorite-events/favorite-events.component';

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
    TranslocoPipe,
    GuestEventsComponent,
    HostedEventsComponent,
    FavoriteEventsComponent
  ],
  templateUrl: './my-events-page.component.html',
})
export class MyEventsPageComponent {
  activeTab: string = 'gast';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

}
