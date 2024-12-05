import { Component, Input } from '@angular/core';
import { StatusEnum } from '../../interfaces/StatusEnum';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventStatusService } from '../../services/event/event-status.service';

@Component({
  selector: 'app-event-status-indicator',
  standalone: true,
  imports: [AngularRemixIconComponent],
  templateUrl: './event-status-indicator.component.html',
})
export class EventStatusIndicatorComponent {
  protected readonly StatusEnum = StatusEnum;
  @Input() status!: StatusEnum;

  constructor(private eventStatus: EventStatusService) {}

  getStatusColor(eventStatus: StatusEnum): string {
    return this.eventStatus.getStatusColor(eventStatus);
  }
}
