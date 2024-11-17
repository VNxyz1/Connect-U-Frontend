import { Component, OnDestroy } from '@angular/core';
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
  providers: [MessageService, EventService],
})
export class CreateEventPageComponent implements OnDestroy {
  items: MenuItem[] | undefined;
  subscription: Subscription | undefined;

  constructor(
  ) {
    // Step navigation items
    this.items = [
      { routerLink: 'step1' },
      { routerLink: 'step2' },
      { routerLink: 'step3' },
    ];
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
