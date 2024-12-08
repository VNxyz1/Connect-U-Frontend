import { Component } from '@angular/core';
import { CreateListComponent } from './create-list/create-list.component';

@Component({
  selector: 'app-event-lists',
  standalone: true,
  imports: [CreateListComponent],
  templateUrl: './event-lists.component.html',
})
export class EventListsComponent {}
