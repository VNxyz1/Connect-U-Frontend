import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EventDetails } from '../../../interfaces/EventDetails';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  standalone: true,
  imports: [
    ImageModule,
    TranslocoPipe,
    TranslocoDatePipe,
    AngularRemixIconComponent,
    CardModule,
    TagModule,
    ProgressSpinnerModule,
  ],
})
export class EventInfoComponent implements OnInit, OnDestroy {
  private _eventDetailsSubscription: Subscription | null = null;

  private _eventDetails!: EventDetails;
  isLoading = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  @Input()
  set eventDetails(value: Observable<EventDetails> | EventDetails | null | undefined) {
    this.handleEventDetailsInput(value);
  }

  @Input() getPreferredGendersString!: (preferredGenders: EventDetails['preferredGenders']) => string;

  get eventDetails(): EventDetails {
    if (!this._eventDetails) {
      throw new Error('Event details are not yet loaded.');
    }
    return this._eventDetails;
  }

  ngOnInit(): void {
    // Check if eventDetails is passed via Router state
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState?.['eventDetails']) {
      console.log("Event details from state:", navigationState['eventDetails']);
      this.handleEventDetailsInput(navigationState['eventDetails']);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this._eventDetailsSubscription?.unsubscribe();
    this._eventDetailsSubscription = null;
  }

  private handleEventDetailsInput(value: Observable<EventDetails> | EventDetails | null | undefined): void {
    if (!value) {
      console.log("No event details provided.");
      this.navigateTo404();
      return;
    }

    // Unsubscribe any previous subscription
    this._eventDetailsSubscription?.unsubscribe();

    if (value instanceof Observable) {
      console.log("Observable received"); // Observable received
      this.isLoading = true; // Start loading
      this._eventDetailsSubscription = value.subscribe({
        next: (details) => {
          if (!details) {
            console.log("Details are null, navigating to 404");
            this.navigateTo404();
          } else {
            console.log("Details loaded:", details);
            this._eventDetails = this.transformEventDetails(details);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error("Failed to load event details:", err);
          this.navigateTo404();
        },
      });
    } else {
      console.log("Static details received:", value);
      this._eventDetails = this.transformEventDetails(value);
      this.isLoading = false;
    }
  }

  private navigateTo404(): void {
    //this.router.navigate(['/404']);
  }

  /**
   * Transform the EventDetails if needed.
   * @param details The EventDetails to transform.
   * @returns Transformed EventDetails.
   */
  private transformEventDetails(details: EventDetails): EventDetails {
    // Perform any transformations on the details here
    return details;
  }
}
