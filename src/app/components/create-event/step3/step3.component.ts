import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event/eventservice';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';
import { NgClass, NgIf } from '@angular/common';
import { EventData } from '../../../services/event/eventservice';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

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
    TranslocoPipe,
  ],
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  title: string | undefined;
  participantsNumber: number | undefined;
  participants: { id: number; name: string }[] = [];
  selectedParticipants: number[] = [];
  genders: { label: string; value: number }[] = [];
  preferredGenders: number[] = [];
  ageValues: number[] = [16, 99];
  submitted: boolean = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private translocoService: TranslocoService
  ) {}

  async ngOnInit() {
    await this.loadGenders();
    await this.insertValuesAgain();
  }

  private async loadGenders() {
    this.eventService.getGenders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          // Transform the genders to include translated label and value
          this.genders = data.map((gender) => {
            let label = '';
            switch (gender.gender) {
              case 1:
                label = this.translocoService.translate('createEventStep3Component.genders.male');
                break;
              case 2:
                label = this.translocoService.translate('createEventStep3Component.genders.female');
                break;
              case 3:
                label = this.translocoService.translate('createEventStep3Component.genders.divers');
                break;
            }
            return { label, value: gender.id };
          });
        },
        error: (error) => console.error('Error loading genders:', error),
      });
  }

  private async insertValuesAgain() {
    const step3Data = await this.eventService.getEventInformation();
    this.title = step3Data.title || '';
    this.participantsNumber = step3Data.participantsNumber || 2;
    this.preferredGenders = step3Data.preferredGenders || [];
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  protected getMaxAgePlaceholder(): string {
    return this.translocoService.translate('createEventStep3Component.ageSection.maxAgePlaceholder');
  }

  protected onAgeChange(index: number, value: string | number) {
    this.ageValues[index] = value === this.getMaxAgePlaceholder() ? 99 : Number(value);
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
    this.eventService.postEvent().subscribe({
      next: (response: any) => {
        const eventId = response?.eventId;

        if (eventId) {
          // Add success message with translation
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'createEventStep3Component.messages.eventCreatedSuccess',
              { title: this.title }
            ),
          });

          setTimeout(() => {
            // Navigate to the created event page
            this.router.navigate([`../../event/${eventId}`], { relativeTo: this.route }).then(() => {});
          }, 2000);
        } else {
          throw new Error(
            this.translocoService.translate('createEventStep3Component.messages.noEventIdError')
          );
        }
      },
      error: (error) => {
        console.error('Error posting event:', error);

        // Add error message with translation
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'createEventStep3Component.messages.eventCreatedError'
          ),
          detail: error.message,
        });

        return;
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
    // Create partial event data object
    const data: Partial<EventData> = {
      participantsNumber: this.participantsNumber,
      preferredGenders: this.preferredGenders,
    };

    // Only include startAge if it's not the default value of 16
    if (this.ageValues[0] !== 16) {
      data.startAge = this.ageValues[0];
    }

    // Only include endAge if it's not the default value of 99
    if (this.ageValues[1] !== 99) {
      data.endAge = this.ageValues[1];
    }

    // Save event information
    await this.eventService.setEventInformation(data);
  }
}
