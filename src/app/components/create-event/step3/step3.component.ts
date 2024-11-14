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
import { NgClass, NgIf } from '@angular/common';

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
    NgClass,
    NgIf,
  ],
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  participantsNumber: number | undefined;
  participants: { id: number; name: string }[] = [];
  selectedParticipants: number[] = [];
  genders: { id: number; gender: number }[] = [];
  preferredGenders: number[] = [];
  ageValues: number[] = [16, 99];
  submitted: boolean = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    public eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.loadGenders();
    await this.insertValuesAgain();
  }

  private async loadGenders() {
    this.eventService.getGenders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => (this.genders = data),
        error: (error) => console.error('Error loading genders:', error),
      });
  }

  private async insertValuesAgain() {
    const step3Data = await this.eventService.getEventInformation();
    this.participantsNumber = step3Data.participantsNumber || 2;
    this.preferredGenders = step3Data.preferredGenders || [];
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  protected onAgeChange(index: number, value: string | number) {
    this.ageValues[index] = value === 'none' ? 99 : Number(value);
  }

  protected complete() {
    this.submitted = true;

    // Validate required fields
    if (
      !this.participantsNumber ||
      this.participantsNumber < 2 ||
      this.ageValues[0] < 16 ||
      this.ageValues[1] > 99 ||
      this.ageValues[0] > this.ageValues[1]
    ) {
      return; // Stop execution if validation fails
    }

    // Save event information
    this.sendEventInformation();

    // Submit event data to the server
    this.eventService.sendEventToServer().subscribe({
      next: (response) => {
        console.log('Event successfully created:', response);
        // Redirect or notify user of success
      },
      error: (error) => {
        console.error('Error creating event:', error);
        // Handle error
      },
      complete: () => {
        console.log('Request complete');
        // Additional actions upon completion
      },
    });
  }

  protected prevPage() {
    this.sendEventInformation();
    this.router.navigate(['../step2'], { relativeTo: this.route })
      .then(() => {
        // Navigation successful
      })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private async sendEventInformation() {
    await this.eventService.setEventInformation({
      participantsNumber: this.participantsNumber,
      preferredGenders: this.preferredGenders,
      startAge: this.ageValues[0],
      endAge: this.ageValues[1],
    });
  }
}
