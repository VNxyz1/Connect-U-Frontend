import { Injectable } from '@angular/core';
import { StatusEnum } from '../../interfaces/StatusEnum';

@Injectable({
  providedIn: 'root',
})
export class EventStatusService {
  constructor() {}

  getStatusColor(eventStatus: StatusEnum): string {
    switch (eventStatus) {
      case StatusEnum.live:
        return 'red-900';
      case StatusEnum.cancelled:
      case StatusEnum.finished:
        return 'gray-600';
      case StatusEnum.upcoming:
        return 'orange-900';
    }
  }
}
