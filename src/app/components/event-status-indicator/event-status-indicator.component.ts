import { booleanAttribute, Component, Input } from '@angular/core';
import { StatusEnum } from '../../interfaces/StatusEnum';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventStatusService } from '../../services/event/event-status.service';
import { TranslocoPipe } from '@jsverse/transloco';

export enum DockPosition {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

@Component({
  selector: 'app-event-status-indicator',
  standalone: true,
  imports: [AngularRemixIconComponent, TranslocoPipe],
  templateUrl: './event-status-indicator.component.html',
})
export class EventStatusIndicatorComponent {
  protected readonly StatusEnum = StatusEnum;
  @Input() status!: StatusEnum;
  @Input({ transform: booleanAttribute }) showText: boolean = false;
  @Input({ transform: booleanAttribute }) invertedColor: boolean = false;

  @Input({ transform: booleanAttribute }) dockingMode: boolean = false;
  @Input() dockPosition: DockPosition = DockPosition.Left;

  constructor(private eventStatus: EventStatusService) {}

  getStatusColor(eventStatus: StatusEnum): string {
    return this.eventStatus.getStatusColor(eventStatus);
  }

  dockMode() {
    if (!this.dockingMode) {
      return 'border-round-lg';
    }
    switch (this.dockPosition) {
      case DockPosition.Left:
        return 'border-round-right-lg';
      case DockPosition.Right:
        return 'border-round-left-lg';
      case DockPosition.Top:
        return 'border-round-bottom-lg';
      case DockPosition.Bottom:
        return 'border-round-top-lg';
    }
  }
}
