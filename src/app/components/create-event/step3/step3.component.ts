import { Component } from '@angular/core';
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
  ],
  providers: [EventService],
  templateUrl: './step3.component.html',
})
export class Step3Component {
  participantsNumber: number | undefined;
  participantsOptions: string[] | undefined;
  selectedParticipants: string[] | undefined;
  genderOptions: string[] | undefined;
  selectedGenders: number[] | undefined; // Adjusted to ensure correct type
  ageValues: number[] = [16, 99]; // Array for min and max age range

  constructor(
    public eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const step3Data = this.eventService.getEventInformation();
    this.participantsNumber = step3Data.participantsNumber;
    this.selectedGenders = step3Data.preferredGenders;
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  complete() {
    this.eventService.setEventInformation({
      participantsNumber: this.participantsNumber,
      preferredGenders: this.selectedGenders,
      startAge: this.ageValues[0],
      endAge: this.ageValues[1],
    });

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
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }
}
