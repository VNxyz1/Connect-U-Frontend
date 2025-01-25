import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { StepsModule } from 'primeng/steps';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-create-event-page',
  standalone: true,
  imports: [StepsModule, NgClass],
  templateUrl: './create-event-page.component.html',
})
export class CreateEventPageComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  subscription: Subscription | undefined;
  isIos = Capacitor.getPlatform() === 'ios';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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
      this.router
        .navigate(['step1'], { relativeTo: this.route })
        .then(() => {})
        .catch(err => {
          console.error('Navigation error:', err);
        });
    } else {
      this.router
        .navigate(['../welcome'])
        .then(() => {})
        .catch(err => {
          console.error('Navigation error:', err);
        });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
