import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import {
  SurveyCreateBody,
  SurveysService,
} from '../../../../../services/surveys/surveys.service';
import { ActivatedRoute } from '@angular/router';

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
    AngularRemixIconComponent,
  ],
  templateUrl: './create-surveys.component.html',
})
export class CreateSurveysComponent implements OnInit {
  @Output() surveyCreated: EventEmitter<void> = new EventEmitter();
  displayDialog: boolean = false;
  showItemInput: boolean = false;
  eventId!: string;
  surveyForm: FormGroup;
  newItem: FormControl;

  constructor(
    private messageService: MessageService,
    private surveyService: SurveysService,
    private readonly route: ActivatedRoute,
    private translocoService: TranslocoService,
  ) {
    this.surveyForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      items: new FormArray([]),
    });

    this.newItem = new FormControl('', Validators.required);
  }
  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
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

  addItem(event: SubmitEvent) {
    event.preventDefault();
    if (this.newItem.valid) {
      this.items.push(new FormControl(this.newItem.value, Validators.required));
      this.newItem.reset();
      this.showItemInput = false;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('createSurveyPage.warning'),
        detail: this.translocoService.translate(
          'createSurveyPage.errorMessages.surveyError',
        ),
      });
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  submitSurvey() {
    if (this.surveyForm.valid) {
      const entries = this.items.controls
        .map(control => control.value?.trim())
        .filter(value => !!value);
      const surveyData: SurveyCreateBody = {
        title: this.surveyForm.value.title,
        description: this.surveyForm.value.description || '',
        entries: entries,
      };
      console.log('umfrage daten', surveyData);
      if (entries.length < 2) {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'createSurveyPage.errorTitle',
          ),
          detail: this.translocoService.translate(
            'createSurveyPage.errorMessages.notEnoughSurveys',
          ),
        });
        return;
      }

      this.surveyService.createNewSurvey(this.eventId, surveyData).subscribe({
        next: response => {
          if (response.ok) {
            this.surveyCreated.emit();
            this.messageService.add({
              severity: 'success',
              summary: 'Erfolg',
              detail: 'Umfrage erfolgreich erstellt!',
            });

            this.surveyForm.reset();
            this.items.clear();
            this.closeDialog();
          }
        },
        error: err => {
          console.error('Fehler beim Erstellen der Umfrage:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail:
              err.error?.message ||
              this.translocoService.translate(
                'createSurveyPage.errorMessages.requirementErr',
              ),
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translocoService.translate('createSurveyPage.errorTitle'),
        detail: this.translocoService.translate(
          'createSurveyPage.errorMessages.requirementErr',
        ),
      });
    }
  }
}
