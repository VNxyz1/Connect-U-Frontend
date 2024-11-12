import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event/eventservice';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    SliderModule,
    MultiSelectModule,
  ],
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  participantsNumber: number | undefined;
  participants: string[] | undefined;
  selectedParticipants: string[] | undefined;
  genders: { id: number; name: string }[] = [];
  preferredGenders: number[] | undefined;
  ageValues: number[] = [16, 99];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadGenders();
    const step3Data = this.eventService.getEventInformation();
    this.participantsNumber = step3Data.participantsNumber || 2;
    this.preferredGenders = step3Data.preferredGenders;
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  private loadGenders() {
    this.eventService.getGenders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => (this.genders = data),
        error: (error) => console.error('Error loading genders:', error),
      });
  }

  complete() {
    this.sendEventInformation();

    // Submitting event data to server
    this.eventService.sendEventToServer().subscribe({
      next: (response) => {
        console.log('Event successfully created:', response);
        // Redirect or notify user of success, if needed
      },
      error: (error) => {
        console.error('Error creating event:', error);
        // Handle error or notify user, if needed
      },
      complete: () => {
        console.log('Request complete');
        // Any additional actions upon completion
      }
    });
  }

  prevPage() {
    this.sendEventInformation();
    this.router.navigate(['../step2'], { relativeTo: this.route })
      .then(() => {
        // Navigation successful
      })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private sendEventInformation() {
    this.eventService.setEventInformation({
      participantsNumber: this.participantsNumber,
      preferredGenders: this.preferredGenders,
      startAge: this.ageValues[0],
      endAge: this.ageValues[1],
    });
  }
}
