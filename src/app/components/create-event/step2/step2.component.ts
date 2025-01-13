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
import { CheckboxModule } from 'primeng/checkbox';
import { NgClass } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

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
    CheckboxModule,
    NgClass,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    TranslocoPipe,
  ],
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  dateAndTime: Date | undefined;
  online: boolean = false;
  street: string = '';
  streetNumber: string = '';
  zipCode: string = '';
  city: string = '';
  hideAddress: boolean = false;

  zipCodeRegex: RegExp = /^\d{5}$/;

  minDate: Date;
  firstDayOfWeek: number = 0;
  dateFormat: string = 'yy/MM/dd';

  submitted: boolean = false;

  constructor(
    public eventService: EventService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
  ) {
    this.setCalenderFormat();
    this.minDate = new Date();
    this.minDate.setMinutes(this.minDate.getMinutes() + 15); // Ensure a minimum 15-minute lead
  }

  async ngOnInit() {
    const step2Data = await this.eventService.getEventCreateInformation();
    this.dateAndTime = step2Data.dateAndTime
      ? new Date(step2Data.dateAndTime)
      : undefined;

    if (!this.dateAndTime || this.dateAndTime < this.minDate) {
      this.dateAndTime = this.minDate;
    }
    this.online = step2Data.isOnline;
    this.street = step2Data.street;
    this.streetNumber = step2Data.streetNumber;
    this.zipCode = step2Data.zipCode;
    this.city = step2Data.city;
    this.hideAddress = !step2Data.showAddress;
  }

  private setCalenderFormat(): void {
    const activeLang = this.translocoService.getActiveLang();

    if (activeLang === 'us') {
      this.firstDayOfWeek = 0; // Sunday
      this.dateFormat = 'mm/dd/yy';
    } else {
      this.firstDayOfWeek = 1; // Monday
      this.dateFormat = 'dd.mm.yy';
    }
  }

  nextPage() {
    this.submitted = true;

    if (!this.dateAndTime || isNaN(this.dateAndTime.getTime())) {
      return;
    }

    if (!this.online) {
      if (
        !this.street.trim() ||
        !this.streetNumber.trim() ||
        !this.zipCode.trim() ||
        !this.city.trim()
      ) {
        return;
      }

      if (!this.zipCodeRegex.test(this.zipCode.trim())) {
        return;
      }
    }

    if (this.dateAndTime.getTime() <= this.minDate.getTime()) {
      this.confirmationService.confirm({
        message: this.translocoService.translate(
          'createEventStep2Component.messages.dateConfirmationMessage',
        ),
        header: this.translocoService.translate(
          'createEventStep2Component.messages.dateConfirmationHeader',
        ),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.confirmationService.close()
          this.navigateNext();
        },
        reject: () => {
          this.confirmationService.close()
          return;
        },
      });
    } else {
      this.navigateNext();
    }
  }

  private navigateNext() {
    this.sendEventInformation();
    this.router
      .navigate(['../step3'], { relativeTo: this.route })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  prevPage() {
    this.sendEventInformation();
    this.router
      .navigate(['../step1'], { relativeTo: this.route })
      .catch(err => {
        console.error('Navigation error:', err);
      });
  }

  private async sendEventInformation() {
    await this.eventService.setEventInformation({
      dateAndTime: this.dateAndTime?.toISOString(),
      isOnline: this.online,
      street: this.online ? '' : this.street,
      streetNumber: this.online ? '' : this.streetNumber.trim(),
      zipCode: this.online ? '' : this.zipCode.trim(),
      city: this.online ? '' : this.city,
      showAddress: !this.hideAddress,
    });
  }
}
