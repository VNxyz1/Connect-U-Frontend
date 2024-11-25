import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AsyncPipe, NgClass } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { GuestEventsComponent } from '../../components/my-events/guest-events/guest-events.component';
import { HostedEventsComponent } from '../../components/my-events/hosted-events/hosted-events.component';
import { FavoriteEventsComponent } from '../../components/my-events/favorite-events/favorite-events.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

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
    FavoriteEventsComponent,
    MultiSelectModule,
    FormsModule,
    FloatLabelModule,
    TabMenuModule,
  ],
  templateUrl: './my-events-page.component.html',
})
export class MyEventsPageComponent {
  activeTab: string = 'gast';
  tabMenuItems: MenuItem[] = [
    {
      label: 'Gast',
      icon: 'pi pi-users',
      command: () => this.setActiveTab('gast'),
    },
    {
      label: 'Erstellt',
      icon: 'pi pi-plus-circle',
      command: () => this.setActiveTab('erstellt'),
    },
    {
      label: 'Favorisiert',
      icon: 'pi pi-star',
      command: () => this.setActiveTab('favorisiert'),
    },
  ];

  filterCategories = [
    { name: 'outdoor' },
    { name: 'indoor' },
    { name: 'music' },
    { name: 'sports' },
    { name: 'gaming' },
    { name: 'eating' },
    { name: 'learning' },
    { name: 'cooking' },
    { name: 'movies' },
    { name: 'adventure' },
    { name: 'party' },
    { name: 'other' },
  ];
  selectedCategories: { name: string }[] = [];

  hasEvents: boolean = false;

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.resetHasEvents();
  }

  updateHasEvents(status: boolean): void {
    this.hasEvents = status;
  }

  resetHasEvents(): void {
    this.hasEvents = false;
  }
}
