import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SurveyDetail, SurveyEvent } from '../../interfaces/Surveys';

type SurveyCreateRes = {
  ok: boolean;
  message: string;
  surveyId: number;
};
type OkResponse = {
  ok: boolean;
  message: string;
};

export type SurveyCreateBody = {
  title: string;
  description?: string;
  entries: string[];
};

@Injectable({
  providedIn: 'root',
})
export class SurveysService {
  constructor(private http: HttpClient) {}

  /**
   * creates a new survey for an event.
   * @param eventId as identifier for a specific event
   * @param body included the content for the survey like title, description and options
   */
  createNewSurvey(
    eventId: string,
    body: SurveyCreateBody,
  ): Observable<SurveyCreateRes> {
    return this.http.post<SurveyCreateRes>('survey/' + eventId, body);
  }
  getSurveyEvent(eventId: string): Observable<SurveyEvent[]> {
    return this.http.get<SurveyEvent[]>('survey/event/' + eventId);
  }
  getSurveyDetail(surveyId: number): Observable<SurveyDetail> {
    return this.http.get<SurveyDetail>('survey/details/' + surveyId);
  }
  deleteSurvey(surveyId: number): Observable<OkResponse> {
    return this.http.delete<OkResponse>('survey/' + surveyId);
  }
}
