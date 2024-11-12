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
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  dateAndTime: Date | undefined;
  online: boolean = false;
  street: string | undefined;
  streetNumber: string | undefined;
  zipCode: string | undefined;
  city: string | undefined;
  hideAddress: string | boolean = true;
  minDate: Date;

  constructor(
    public eventService: EventService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    this.minDate.setMinutes(this.minDate.getMinutes() + 15);
  }

  ngOnInit() {
    const step2Data = this.eventService.getEventInformation();
    this.dateAndTime = step2Data.dateAndTime ? new Date(step2Data.dateAndTime) : this.minDate;
    this.online = step2Data.isOnline;
    this.street = step2Data.street;
    this.streetNumber = step2Data.streetNumber;
    this.zipCode = step2Data.zipCode;
    this.city = step2Data.city;
    this.hideAddress = !step2Data.showAddress;
  }

  nextPage() {
    if (this.dateAndTime?.getTime() === this.minDate.getTime()) {
      // Show confirmation dialog if date is still set to minDate
      this.confirmationService.confirm({
        message: 'The selected date and time are set to the minimum. Do you want to proceed?',
        header: 'Confirm Date Selection',
        icon: 'pi pi-exclamation-circle',
        accept: () => {
          this.proceedToNextPage(); // Perform nextPage actions on confirmation
        },
        reject: () => {
          // Do nothing if the user selects "No"
        },
      });
    } else {
      this.proceedToNextPage();
    }
  }

  private proceedToNextPage() {
    this.sendEventInformation();
    this.router.navigate(['../step3'], { relativeTo: this.route })
      .then(() => {
        // Navigation successful
      })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  prevPage() {
    this.sendEventInformation();
    this.router.navigate(['../step1'], { relativeTo: this.route })
      .then(() => {
        // Navigation successful
      })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private sendEventInformation() {
    this.eventService.setEventInformation({
      dateAndTime: this.dateAndTime?.toISOString(),
      isOnline: this.online,
      street: this.online ? undefined : this.street,
      streetNumber: this.online ? undefined : this.streetNumber,
      zipCode: this.online ? undefined : this.zipCode,
      city: this.online ? undefined : this.city,
      showAddress: !this.hideAddress,
    });
  }
}
