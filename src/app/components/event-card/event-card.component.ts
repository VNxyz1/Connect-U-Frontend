import {booleanAttribute, Component, Inject, Input, LOCALE_ID} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';
import {EventCardItem} from '../../interfaces/EventCardItem';
import {DatePipe} from '@angular/common';
import {EventService} from '../../services/event/eventservice';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    TagModule,
    AngularRemixIconComponent,
    SkeletonModule,
    DatePipe,
  ],
  templateUrl: './event-card.component.html',
})
export class EventCardComponent {
  @Input({ transform: booleanAttribute }) skeleton: boolean = false;
  @Input() event!: EventCardItem;

  constructor(@Inject(LOCALE_ID) locale: string) {
    console.log(locale);
  }


  /**
   * Accepts an ISO-Date-String
   * @param date ISO-Date
   */
  toDate(date: string): Date {
    return new Date(date);
  }

}
