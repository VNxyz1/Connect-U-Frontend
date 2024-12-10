import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type SurveyCreateRes = {
  ok: boolean;
  message: string;
  surveyId: number;
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
}
