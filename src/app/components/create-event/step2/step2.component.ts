import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { EventService } from '../../../services/event/eventservice';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { NgClass, NgIf } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    CalendarModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    RadioButtonModule,
    CheckboxModule,
    NgClass,
    NgIf,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  dateAndTime: Date | undefined;
  online: boolean = false;
  street: string = '';
  streetNumber: string = '';
  zipCode: string = '';
  city: string = '';
  hideAddress: boolean = false; // Updated type for better usage

  zipCodeRegex: RegExp = /^[A-Za-z0-9 ]{3,10}$/;

  minDate: Date;
  submitted: boolean = false;

  constructor(
    public eventService: EventService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    this.minDate.setMinutes(this.minDate.getMinutes() + 15); // Ensure a minimum 15-minute lead
  }

  async ngOnInit() {
    const step2Data = await this.eventService.getEventInformation(); // Await data retrieval
    // Ensure `dateAndTime` is a valid Date object or leave undefined
    this.dateAndTime = step2Data.dateAndTime
      ? new Date(step2Data.dateAndTime)
      : undefined;

    if (!this.dateAndTime) {
      // Default to `minDate` if no valid date exists
      this.dateAndTime = this.minDate;
    }
    this.online = step2Data.isOnline;
    this.street = step2Data.street;
    this.streetNumber = step2Data.streetNumber;
    this.zipCode = step2Data.zipCode;
    this.city = step2Data.city;
    this.hideAddress = !step2Data.showAddress;
  }

  nextPage() {
    this.submitted = true;

    // Validate Date & Time
    if (!this.dateAndTime || isNaN(this.dateAndTime.getTime())) {
      return; // Block navigation if invalid
    }

    // Validate Address Fields if the event is not online
    if (!this.online) {
      if (
        !this.street.trim() ||
        !this.streetNumber.trim() ||
        !this.zipCode.trim() ||
        !this.city.trim()
      ) {
        return; // Block navigation if address fields are incomplete
      }

      if (!this.zipCodeRegex.test(this.zipCode.trim())) {
        return; // Block navigation if ZIP code is invalid
      }
    }

    // Check for minimum or earlier date
    if (this.dateAndTime.getTime() <= this.minDate.getTime()) {
      this.confirmationService.confirm({
        message: 'Date and time are set to the minimum. Do you want to proceed?',
        header: 'Confirm Date Selection',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.navigateNext();
        },
        reject: () => {
          console.log('User declined to proceed.');
        },
      });
    } else {
      this.navigateNext();
    }
  }

  private navigateNext() {
    this.sendEventInformation();
    this.router.navigate(['../step3'], { relativeTo: this.route })
      .then(() => {
        console.log('Navigation to step 3 successful.');
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }

  prevPage() {
    this.sendEventInformation();
    this.router.navigate(['../step1'], { relativeTo: this.route })
      .then(() => {
        console.log('Navigation to step 1 successful.');
      })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private async sendEventInformation() {
    await this.eventService.setEventInformation({
      dateAndTime: this.dateAndTime?.toISOString(),
      isOnline: this.online,
      street: this.online ? "" : this.street,
      streetNumber: this.online ? "" : this.streetNumber.trim(),
      zipCode: this.online ? "" : this.zipCode.trim(),
      city: this.online ? "" : this.city,
      showAddress: !this.hideAddress,
    });
  }
}
