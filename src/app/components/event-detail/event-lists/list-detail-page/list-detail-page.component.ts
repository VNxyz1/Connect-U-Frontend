import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './list-detail-page.component.html',
})
export class ListDetailPageComponent {
  @Input()
  set id(id: string) {
    this.eventId = id;
  }

  eventId!: string;
}
