import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { MenuItem, MessageService } from 'primeng/api';
import { EventService } from '../../services/event/eventservice';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-create-event-page',
  standalone: true,
  imports: [AngularRemixIconComponent, ToastModule, StepsModule],
  templateUrl: './create-event-page.component.html',
  providers: [MessageService, EventService]
})
export class CreateEventPageComponent {
  items: MenuItem[] | undefined;

  subscription: Subscription | undefined;

  constructor(public messageService: MessageService, public eventService: EventService) {}

  ngOnInit() {
    this.items = [
      {
        label: '',
        routerLink: 'step1'
      },
      {
        label: '',
        routerLink: 'step2'
      },
      {
        label: '',
        routerLink: 'step3'
      }
    ];

    this.subscription = this.eventService.eventComplete$.subscribe((step1) => {
      this.messageService.add({ severity: 'success', summary: 'Event ' + step1.title + 'created.' });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
