import {Component, OnInit} from '@angular/core';
import {CreateSurveysComponent} from './create-surveys/create-surveys/create-surveys.component';
import {CreateListComponent} from '../event-lists/create-list/create-list.component';
import {EventCardComponent} from '../../event-card/event-card.component';
import {ActivatedRoute} from '@angular/router';
import {SurveysService} from '../../../services/surveys/surveys.service';
import {CardSurveyComponent} from './card-survey/card-survey.component';
import {SurveyEvent} from '../../../interfaces/Surveys';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-event-surveys',
  standalone: true,
  imports: [CreateSurveysComponent, CreateListComponent, EventCardComponent, CardSurveyComponent, AsyncPipe],
  templateUrl: './event-surveys.component.html',
})
export class EventSurveysComponent implements OnInit {
  eventId!: string | undefined;
  eventSurveys$!: Observable<SurveyEvent[]>

  constructor(
    private readonly route: ActivatedRoute,
    private surveysService: SurveysService,
  ) {
    this.fetchSurveys()
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.eventId);
    this.fetchSurveys();
  }

  fetchSurveys(): void {
    if (this.eventId) {
      this.eventSurveys$ = this.surveysService.getSurveyEvent(this.eventId)
    }
  }
}
