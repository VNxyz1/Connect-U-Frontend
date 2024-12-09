import { Component } from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {TranslocoPipe} from '@jsverse/transloco';
import {DialogModule} from 'primeng/dialog';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from "primeng/api";
import {InputTextareaModule} from "primeng/inputtextarea";
import {AngularRemixIconComponent} from "angular-remix-icon";

@Component({
  selector: 'app-create-surveys',
  standalone: true,
  imports: [
    Button,
    TranslocoPipe,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    InputTextareaModule,
    ButtonDirective,
    AngularRemixIconComponent
  ],
  templateUrl: './create-surveys.component.html'
})
export class CreateSurveysComponent {
  displayDialog: boolean = false;
  showItemInput: boolean = false;
  surveyForm: FormGroup;
  newItem: FormControl;

  constructor(private messageService: MessageService) {
    this.surveyForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      items: new FormArray([]),
    });

    this.newItem = new FormControl('', Validators.required);
  }

  get items() {
    return this.surveyForm.get('items') as FormArray;
  }

  openDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.showItemInput = false;
  }

  toggleItemInput() {
    this.showItemInput = !this.showItemInput;
  }

  addItem() {
    if (this.newItem.valid) {
      this.items.push(new FormControl(this.newItem.value, Validators.required));
      this.newItem.reset();
      this.showItemInput = false;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warnung',
        detail: 'Bitte geben Sie einen gültigen Item-Namen ein.',
      });
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  submitSurvey() {
    if (this.surveyForm.valid) {
      console.log('Survey Data:', this.surveyForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Erfolg',
        detail: 'Umfrage erfolgreich erstellt!',
      });
      this.surveyForm.reset();
      this.items.clear();
      this.closeDialog();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Bitte füllen Sie alle Pflichtfelder aus!',
      });
    }
  }

  protected readonly FormControl = FormControl;
}
