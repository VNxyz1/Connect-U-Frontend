import { Component, Input, OnInit } from '@angular/core';
import { CreateSurveysComponent } from './create-surveys/create-surveys/create-surveys.component';
import { EventCardComponent } from '../../event-card/event-card.component';
import { SurveysService } from '../../../services/surveys/surveys.service';
import { CardSurveyComponent } from './card-survey/card-survey.component';
import { SurveyEvent } from '../../../interfaces/Surveys';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CreateListComponent } from '../event-lists/list-overview-page/create-list/create-list.component';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-event-surveys',
  standalone: true,
  imports: [CreateSurveysComponent, CardSurveyComponent, AsyncPipe],
  templateUrl: './event-surveys.component.html',
})
export class EventSurveysComponent implements OnInit {
  @Input()
  set id(id: string) {
    this._eventId = id;
  }

  _eventId!: string;
  private _surveySubject$!: BehaviorSubject<SurveyEvent[]>;
  eventSurveys$!: Observable<SurveyEvent[]>;

  constructor(
    private readonly surveysService: SurveysService,
    private readonly sockets: SocketService,
  ) {}

  ngOnInit(): void {
    this.surveysService.getSurveyEvent(this._eventId).subscribe({
      next: res => {
        this._surveySubject$ = new BehaviorSubject(res);
        this.eventSurveys$ = this._surveySubject$.asObservable();
      },
    });

    this.sockets.on('updateSurveyOverview').subscribe({
      next: () => {
        this.fetchSurveys();
      },
    });
  }

  fetchSurveys(): void {
    this.surveysService.getSurveyEvent(this._eventId).subscribe({
      next: res => this._surveySubject$.next(res),
    });
  }

  handleSurveyChange(): void {
    this.fetchSurveys();
  }
}
