import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [],
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
