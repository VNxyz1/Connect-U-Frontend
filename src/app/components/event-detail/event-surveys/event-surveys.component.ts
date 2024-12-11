import { Component } from '@angular/core';
import { CreateSurveysComponent } from './create-surveys/create-surveys/create-surveys.component';
import { CreateListComponent } from '../event-lists/list-overview-page/create-list/create-list.component';

@Component({
  selector: 'app-event-surveys',
  standalone: true,
  imports: [CreateSurveysComponent, CreateListComponent],
  templateUrl: './event-surveys.component.html',
})
export class EventSurveysComponent {}
