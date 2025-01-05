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
import { Subject, takeUntil } from 'rxjs';
import { NgClass } from '@angular/common';
import { EventData } from '../../../services/event/eventservice';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime } from 'rxjs/operators';

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
    NgClass,
    TranslocoPipe,
    MultiSelectModule,
  ],
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  title: string | undefined;
  participantsNumber: number | undefined;
  genders: { label: string; value: number }[] = [];
  preferredGenders: number[] = [];
  ageValues: (number | undefined)[] = [16, 99];
  private ageChangeSubject = new Subject<{ index: number; value: number }>();
  submitted: boolean = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private translocoService: TranslocoService
  ) {
    this.ageChangeSubject
      .pipe(debounceTime(300)) // Adjust debounce time as needed (300ms is a good default)
      .subscribe(({ index, value }) => {
        this.applyAgeChange(index, value);
      });
  }

  async ngOnInit() {
    this.ageChangeSubject
      .pipe(debounceTime(300)) // Adjust debounce time as needed (300ms is a good default)
      .subscribe(({ index, value }) => {
        this.applyAgeChange(index, value);
      });

    await this.loadGenders();
    await this.insertValuesAgain();
  }

  private async loadGenders() {
    this.eventService
      .getGenders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.genders = data.map(gender => {
            let label = '';
            switch (gender.gender) {
              case 1:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.male',
                );
                break;
              case 2:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.female',
                );
                break;
              case 3:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.divers',
                );
                break;
            }
            return { label, value: gender.id };
          });
        },
        error: error => console.error('Error loading genders:', error),
      });
  }

  private async insertValuesAgain() {
    const step3Data = await this.eventService.getEventCreateInformation();
    this.title = step3Data.title || '';
    this.participantsNumber = step3Data.participantsNumber || 2;
    this.preferredGenders = step3Data.preferredGenders || [];
    this.ageValues = [step3Data.startAge || 16, step3Data.endAge || 99];
  }

  protected getMaxAgePlaceholder(): string {
    return this.translocoService.translate(
      'createEventStep3Component.ageSection.maxAgePlaceholder',
    );
  }

  protected onSliderChange(event: (number | undefined)[]): void {
    // Sync slider changes to the inputs
    this.ageValues = [...event]; // Ensure the array is updated
  }

  protected onAgeChange(index: number, value: string | number): void {
    // Handle empty input
    if (value === '') {
      this.ageValues[index] = undefined; // Set the value to `undefined` temporarily
      return;
    }

    const numericValue = Number(value);

    // Ignore invalid input (non-numeric values)
    if (isNaN(numericValue)) {
      return;
    }

    // Update the age value without enforcing constraints immediately
    this.ageValues[index] = numericValue;

    // Debounce applying the value to the slider
    this.ageChangeSubject.next({ index, value: numericValue });
  }

  protected onAgeBlur(index: number): void {
    // Check if the input is not undefined
    if (this.ageValues[index] !== undefined) {
      const constrainedValue = Math.max(
        16,
        Math.min(this.ageValues[index] as number, index === 0 ? this.ageValues[1] ?? 99 : 99)
      );

      // Apply the constrained value
      this.ageValues[index] = constrainedValue;

      // Ensure the minimum age does not exceed the maximum age
      if (this.ageValues[0] !== undefined && this.ageValues[1] !== undefined && this.ageValues[0] > this.ageValues[1]) {
        this.ageValues[1] = this.ageValues[0];
      }

      // Sync the slider with the updated values
      this.onSliderChange([...this.ageValues]);
    } else {
      // If the input is undefined (cleared), reset to default values
      this.ageValues[index] = index === 0 ? 16 : 99;

      // Sync the slider with the updated values
      this.onSliderChange([...this.ageValues]);
    }
  }

  private applyAgeChange(index: number, value: number): void {
    // Apply constraints with debounce

    const stringValue = value.toString();

    if (stringValue === '') {
      this.ageValues[index] = undefined; // Temporarily set the value to `undefined`
      return;
    }

    if (index === 0) {
      const numericValue = Number(value); // Convert the input value to a number
      if (isNaN(numericValue)) return; // Do nothing if the value is not a valid number

      // Apply constraints for the minimum age
      this.ageValues[0] = Math.max(0, Math.min(numericValue, <number>this.ageValues[1]));
    } else if (index === 1) {
      const numericValue = Number(value); // Convert the input value to a number
      if (isNaN(numericValue)) return; // Do nothing if the value is not a valid number

      // Apply constraints for the maximum age
      this.ageValues[1] = Math.min(99, Math.max(numericValue, <number>this.ageValues[0]));
    }

    // Ensure the min age is not greater than the max age
    if (this.ageValues[0] && this.ageValues[1] && this.ageValues[0] > this.ageValues[1]) {
      this.ageValues[1] = this.ageValues[0];
    }
  }

  protected complete() {
    this.submitted = true;

    if (
      this.ageValues[0] && this.ageValues[1] && (
      !this.participantsNumber ||
      this.participantsNumber < 2 ||
      this.ageValues[0] < 16 ||
      this.ageValues[1] > 99 ||
      this.ageValues[0] > this.ageValues[1])
    ) {
      return;
    }

    this.sendEventInformation();

    this.eventService.postEvent().subscribe({
      next: (response: any) => {
        const eventId = response?.eventId;

        if (eventId) {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'createEventStep3Component.messages.eventCreatedSuccess',
              { title: this.title }
            ),
          });

          setTimeout(() => {
            this.router.navigate([`../../event/${eventId}`], {
              relativeTo: this.route,
              queryParams: { fromCreate: true },
            });
          }, 2000);
        } else {
          throw new Error(
            this.translocoService.translate(
              'createEventStep3Component.messages.noEventIdError'
            )
          );
        }
      },
      error: error => {
        console.error('Error posting event:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'createEventStep3Component.messages.eventCreatedError'
          ),
          detail: this.translocoService.translate(
            'createEventStep3Component.messages.eventCreatedErrorMessage'
          ),
        });
        return;
      },
    });
  }

  protected prevPage() {
    this.sendEventInformation();
    this.router
      .navigate(['../step2'], { relativeTo: this.route })
      .then(() => {})
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private async sendEventInformation() {
    const data: Partial<EventData> = {
      participantsNumber: this.participantsNumber,
      preferredGenders: this.preferredGenders,
    };

    if (this.ageValues[0] !== 16) {
      data.startAge = this.ageValues[0];
    }

    if (this.ageValues[1] !== 99) {
      data.endAge = this.ageValues[1];
    }

    await this.eventService.setEventInformation(data);
  }
}
