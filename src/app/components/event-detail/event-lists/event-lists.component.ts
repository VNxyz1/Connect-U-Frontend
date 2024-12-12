import { Component, Input } from '@angular/core';
import { CreateListComponent } from './list-overview-page/create-list/create-list.component';

import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';

@Component({
  selector: 'app-event-lists',
  standalone: true,
  imports: [
    CreateListComponent,
    AsyncPipe,
    AngularRemixIconComponent,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './event-lists.component.html',
})
export class EventListsComponent {
  @Input()
  set id(id: string) {}
}
