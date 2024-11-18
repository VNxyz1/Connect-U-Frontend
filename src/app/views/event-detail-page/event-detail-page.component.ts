import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ImageModule,
    TranslocoPipe,
    CardModule,
    TagModule,
    Button,
    AngularRemixIconComponent,
  ],
  templateUrl: './event-detail-page.component.html',
})
export class EventDetailPageComponent {
  /**
   * The eventId is extracted from the route param.
   * Documentation: [Angular.dev](https://angular.dev/guide/routing/common-router-tasks#getting-route-information)
   */
  @Input()
  set id(eventId: string) {}
}
