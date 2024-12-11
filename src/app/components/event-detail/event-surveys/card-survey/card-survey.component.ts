import {Component, Input, OnInit,} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {ProgressBarModule} from 'primeng/progressbar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {AvatarModule} from 'primeng/avatar';
import {SurveyDetail, SurveyEvent} from "../../../../interfaces/Surveys";
import {AngularRemixIconComponent} from "angular-remix-icon";
import {AsyncPipe, NgClass} from "@angular/common";
import {SurveysService} from "../../../../services/surveys/surveys.service";
import {Observable} from "rxjs";

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
    AsyncPipe
  ],
  templateUrl: './card-survey.component.html'
})
export class CardSurveyComponent implements OnInit{
  @Input() survey!: SurveyEvent;
  surveyDetail$!: Observable<SurveyDetail>;
  expanded: boolean = false; // Zustandsvariable für das Ausklappen der Card

  constructor(private surveyService: SurveysService) {}

  ngOnInit(): void {
    this.fetchSurveyDetails()
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

}
