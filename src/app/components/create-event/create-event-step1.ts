import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/eventservice';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass, NgIf } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';

@Component({
  standalone: true,
  template: `
    <div class="pFocusTrap">
        <ng-template pTemplate="content">
          <div class="p-fluid">
            <div class="field">
              <p-floatLabel>
                <input
                  id="event-title"
                  type="text"
                  required
                  pInputText
                />
                <label for="event-title">Title</label>
              </p-floatLabel>
            </div>
            <div class="field">
              <p-dropdown
                [options]="categories"
                [(ngModel)]="selectedCategories"
                placeholder="Select a Category"
                [editable]="true"
                optionLabel="name" />
            </div>
            <div class="field">
              <!-- tags -->
            </div>
            <div class="field">
              <p-floatLabel>
                <textarea
                  id="description"
                  rows="5" cols="30"
                  pInputTextarea>
                </textarea>
                <label for="description">Description</label>
              </p-floatLabel>
            </div>
          </div>
        </ng-template>
        <ng-template pTemplate="footer">
          <div class="grid grid-nogutter justify-content-end">
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
    Button,
    AngularRemixIconComponent,
    FloatLabelModule,
    DropdownModule,
    NgClass,
    CardModule,
    FormsModule,
    NgIf,
    InputTextareaModule,
    ChipsModule,
  ],
  providers: [EventService]
})
export class CreateEventStep1 implements OnInit {
  step1: any;

  categories: string[] | undefined;
  selectedCategories: string | undefined;

  constructor(public eventService: EventService, private router: Router) {}

  ngOnInit() {

  }

  nextPage() {
    if (this.step1.title && this.step1.category && this.step1.image) {
      this.step1.eventService.step1 = this.step1;
      this.router.navigate(['create-event/step2']);

    }
    return;
  }
}
