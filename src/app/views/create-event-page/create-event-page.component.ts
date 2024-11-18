import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { MenuItem, MessageService } from 'primeng/api';
import { EventService } from '../../services/event/eventservice';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-event-page',
  standalone: true,
  imports: [ToastModule, StepsModule],
  templateUrl: './create-event-page.component.html',
  providers: [MessageService, EventService, AuthService],
})
export class CreateEventPageComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Step navigation items
    this.items = [
      { routerLink: 'step1' },
      { routerLink: 'step2' },
      { routerLink: 'step3' },
    ];
  }

  ngOnInit(): void {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // Navigate to step1 if logged in
      this.router.navigate(['step1'], { relativeTo: this.route }).then(() => {
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    } else {
      // Navigate to ../welcome if not logged in
      this.router.navigate(['../welcome']).then(() => {
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    }
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
