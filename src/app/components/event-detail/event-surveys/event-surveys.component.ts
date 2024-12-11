import {Component, OnInit} from '@angular/core';
import {CreateSurveysComponent} from './create-surveys/create-surveys/create-surveys.component';
import {CreateListComponent} from '../event-lists/create-list/create-list.component';
import {EventCardComponent} from '../../event-card/event-card.component';
import {ActivatedRoute} from '@angular/router';
import {SurveysService} from '../../../services/surveys/surveys.service';

@Component({
  selector: 'app-event-surveys',
  standalone: true,
  imports: [CreateSurveysComponent, CreateListComponent, EventCardComponent],
  templateUrl: './event-surveys.component.html',
})
export class EventSurveysComponent implements OnInit {
  eventId!: string | undefined;


  constructor(
    private readonly route: ActivatedRoute,
    private surveysService: SurveysService,
  ) {
    this.fetchSurveys()
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.eventId);
    this.fetchSurveys(); // Aufruf verschoben
  }

  fetchSurveys(): void {
    if (this.eventId) {
      this.surveysService.getSurveyEvent(this.eventId).subscribe({
        next: (data) => {
          console.log(data);

        },
        error: (err) => {
          console.error('Error fetching surveys:', err);
        }
      });
    } else {
      console.error('eventId is undefined');
    }
  }
}
