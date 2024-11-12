import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/eventservice';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SliderModule } from 'primeng/slider';

@Component({
  standalone: true,
  template: `
    <div class="pFocusTrap mt-8">
        <ng-template pTemplate="content">
          <div class="p-fluid">
            <div class="field">
              <p-floatLabel class="mb-4">
                <input id="participantsNumber" type="number" pInputText [(ngModel)]="participantsNumber" />
                <label for="participantsNumber">Participants Number</label>
              </p-floatLabel>

            </div>
            <div class="field">
              <p-dropdown
                [options]="participantsOptions"
                [(ngModel)]="selectedParticipants"
                placeholder="Add participants"
                [editable]="true"
                optionLabel="name" />
            </div>
            <div class="field">
              <p-dropdown
                [options]="genderOptions"
                [(ngModel)]="selectedGenders"
                placeholder="Desired genders"
                [editable]="true"
                optionLabel="name" />
            </div>
            <div class="field">
              <p-slider [(ngModel)]="ageValues" [range]="true" styleClass="w-14rem" />

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
              severity="success"
              label="Finish"
              styleClass=""
              class="align-items-center"
              (onClick)="complete()">
              <ng-template pTemplate="icon">
                <rmx-icon
                  class="mr-2"
                  style="width: 16px; height: 16px"
                  name="check-line"></rmx-icon>
              </ng-template>
            </p-button>
          </div>
        </ng-template>
    </div>
  `,
  imports: [
    CardModule,
    InputTextModule,
    NgClass,
    NgIf,
    DropdownModule,
    FormsModule,
    FloatLabelModule,
    InputTextareaModule,
    Button,
    AngularRemixIconComponent,
    SliderModule,
  ],
  providers: [EventService]
})
export class CreateEventStep3 implements OnInit {
  eventInformation: any;
  step3: any;

  participantsNumber: number | undefined;
  participantsOptions: string[] | undefined;
  selectedParticipants: string[] | undefined;
  genderOptions: string[] | undefined;
  selectedGenders: any;
  ageValues: number[] = [16, 99];


  constructor(public eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.step3 = this.eventService.getEventInformation().step3;
  }

  complete() {
      this.eventService.eventInformation.step3 = this.step3;
      this.eventService.complete();
  }

  prevPage() {
    this.router.navigate(['create-event/step2']);
  }
}
