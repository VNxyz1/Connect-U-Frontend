import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import {
  SurveyDetail,
  SurveyEntry,
  SurveyEvent,
} from '../../../../interfaces/Surveys';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { SurveysService } from '../../../../services/surveys/surveys.service';
import { Observable } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-card-survey',
  standalone: true,
  imports: [
    CardModule,
    ButtonDirective,
    ProgressBarModule,
    AvatarGroupModule,
    AvatarModule,
    AngularRemixIconComponent,
    NgClass,
    AsyncPipe,
    CheckboxModule,
    FormsModule,
    SidebarModule,
    RouterLink,
    TranslocoPipe,
    SkeletonModule,
  ],
  templateUrl: './card-survey.component.html',
})
export class CardSurveyComponent implements OnInit {
  @Input() survey!: SurveyEvent;
  @Output() surveyDeleted: EventEmitter<void> = new EventEmitter();
  surveyDetail$!: Observable<SurveyDetail>;
  expanded: boolean = false;
  sidebarVisible: boolean = false;
  selectedSurveyEntries: SurveyEntry[] = [];
  // votes muss noch dynamisch angepasst werden für die Patch route!
  votes: number = 1;

  constructor(
    private surveyService: SurveysService,
    private translocoService: TranslocoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.fetchSurveyDetails();
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.fetchSurveyDetails();
    }
  }

  fetchSurveyDetails(): void {
    this.surveyDetail$ = this.surveyService.getSurveyDetail(this.survey.id);
  }

  openSidebar(entries: SurveyEntry[]): void {
    this.selectedSurveyEntries = entries;
    this.sidebarVisible = true;
  }

  maxVotes(entries: SurveyEntry[]): number {
    if (!entries || entries.length === 0) {
      return 0;
    }
    return Math.max(...entries.map(entry => entry.users.length));
  }

  getSortedEntries(entries: SurveyEntry[]): SurveyEntry[] {
    return [...entries].sort((a, b) => b.users.length - a.users.length);
  }

  deleteSurvey(surveyId: number): void {
    this.confirmationService.confirm({
      message: this.translocoService.translate(
        'surveyCardPage.deleteConfirmationMessage',
      ),
      header: this.translocoService.translate(
        'surveyCardPage.deleteConfirmationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.surveyService.deleteSurvey(surveyId).subscribe({
          next: () => {
            this.surveyDeleted.emit();
            // Erfolgsnachricht anzeigen
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate(
                'surveyCardPage.successTitle',
              ),
              detail: this.translocoService.translate(
                'surveyCardPage.deleteSuccessMessage',
              ),
            });

            console.log('Survey successfully deleted!');
          },
          error: err => {
            // Fehlernachricht anzeigen
            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate(
                'surveyCardPage.errorTitle',
              ),
              detail: this.translocoService.translate(
                'surveyCardPage.deleteErrorMessage',
              ),
            });
            console.error('Error deleting survey:', err);
          },
        });
      },
      reject: () => {
        console.log('Survey deletion cancelled.');
      },
    });
  }
}
/*

 */
