import { Component } from '@angular/core';
import {CardModule} from 'primeng/card';
import {ImageModule} from 'primeng/image';
import {TagModule} from 'primeng/tag';
import {AngularRemixIconComponent} from 'angular-remix-icon';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    TagModule,
    AngularRemixIconComponent
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {

}
