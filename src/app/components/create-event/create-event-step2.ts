import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/eventservice';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';

class user {
  id: number | undefined;
}

@Component({
  standalone: true,
  template: `
    <div class="pFocusTrap mt-8">
        <ng-template pTemplate="content">
          <div class="p-fluid">
            <div class="field">
              <p-floatLabel>
                <p-calendar
                  [(ngModel)]="date"
                  [showIcon]="true"
                  [showOnFocus]="false"
                  inputId="buttondisplay">
                  <ng-template pTemplate="inputicon" let-clickCallBack="clickCallBack">
                    <rmx-icon
                      style="width: 16px; height: 16px"
                      name="calendar-line" (click)="clickCallBack($event)"></rmx-icon>
                  </ng-template>
                </p-calendar>
                <label for="date">Date</label>
              </p-floatLabel>
            </div>
            <div class="field">
              <p-floatLabel>
                <p-calendar
                  [(ngModel)]="time"
                  [iconDisplay]="'input'"
                  [showIcon]="true"
                  [timeOnly]="true"
                  inputId="templatedisplay">
                  <ng-template pTemplate="time" let-clickCallBack="clickCallBack">
                          <rmx-icon
                            style="width: 16px; height: 16px"
                            name="time-line" (click)="clickCallBack($event)"></rmx-icon>
                  </ng-template>
                </p-calendar>
                <label for="time">Time</label>
              </p-floatLabel>
            </div>
            <h2>Address</h2>
            <div class="field">
              <p-radioButton
                name="online"
                value="true"
                label="Online-Event"
                [(ngModel)]="online"
                id="online-true"
                variant="filled" />
            </div>
            <div class="field justify-content-between">
              <p-floatLabel>
                <input pInputText id="street" [(ngModel)]="street" />
                <label for="street">Street</label>
              </p-floatLabel>
              <p-floatLabel>
                <input pInputText id="hnr" [(ngModel)]="hnr" />
                <label for="hnr">HNr</label>
              </p-floatLabel>
            </div>
            <div class="field justify-content-between">
              <p-floatLabel>
                <input pInputText id="zipCode" [(ngModel)]="zipCode" />
                <label for="zipCode">ZIP Code</label>
              </p-floatLabel>
              <p-floatLabel>
                <input pInputText id="city" [(ngModel)]="city" />
                <label for="city">City</label>
              </p-floatLabel>
            </div>
            <div class="field">
              <p-radioButton
                name="hideAddress"
                value="true"
                label="Hide Address"
                aria-describedby="hideAddress-help"
                [(ngModel)]="hideAdress"
                id="hideAddress-true"
                variant="filled" />
              <small id="hideAddress-help">
                If selected, only Area Code and City are published.
              </small>
            </div>
          </div>
        </ng-template>
        <ng-template pTemplate="footer">
          <div class="grid grid-nogutter justify-content-between">
            <p-button
              [raised]="true"
              label="Back"
              styleClass=""
              class="align-items-center"
              (onClick)="prevPage()">
              <ng-template pTemplate="icon">
                <rmx-icon
                  class="mr-2"
                  style="width: 16px; height: 16px"
                  name="arrow-left-circle-line"></rmx-icon>
              </ng-template>
            </p-button>
            <p-button
              [raised]="true"
              severity="secondary"
              label="Continue"
              styleClass=""
              class="align-items-center"
              (onClick)="nextPage()">
              <ng-template pTemplate="icon">
                <rmx-icon
                  class="mr-2"
                  style="width: 16px; height: 16px"
                  name="arrow-right-circle-line"></rmx-icon>
              </ng-template>
            </p-button>
          </div>
        </ng-template>
    </div>
  `,
  imports: [
    CardModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    SliderModule,
    Button,
    AngularRemixIconComponent,
    CalendarModule,
    RadioButtonModule,
  ],
  providers: [EventService]
})
export class CreateEventStep2 implements OnInit {
  step2: any;

  date: Date | undefined;
  time: Date | undefined;
  online: boolean | false | undefined;
  street: string | undefined;
  hnr:  string | undefined;
  zipCode: string | undefined;
  city: string | undefined;
  hideAdress: boolean | undefined;

  constructor(public eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.step2 = this.eventService.getEventInformation().step2;
  }

  nextPage() {
    if (this.step2.date && this.step2.time) {
      this.step2.eventService.step2 = this.step2;
      this.router.navigate(['create-event/step3']);
    }
    return;
  }

  prevPage() {
    this.router.navigate(['create-event/step1']);
  }
}
