import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageModule } from 'primeng/image';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { AsyncPipe } from '@angular/common';
import { Gender, GenderEnum } from '../../interfaces/Gender';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [
    ImageModule,
    TranslocoPipe,
    CardModule,
    TagModule,
    Button,
    AngularRemixIconComponent,
    AsyncPipe,
  ],
  templateUrl: './event-detail-page.component.html',
})
export class EventDetailPageComponent implements OnInit {
  eventId!: string;
  eventDetails$!: Observable<EventDetails>;
  preferredGenders!: Gender[] | null;
  dateAndTime!: string | null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventService: EventService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    if (this.eventId) {
      this.eventDetails$ = this.eventService.getEventDetails(this.eventId);
    }

    this.eventDetails$.subscribe(eventDetails => {
      this.preferredGenders = eventDetails.preferredGenders;
      this.dateAndTime = eventDetails.dateAndTime;
    });
  }

  getPreferredGendersString(): string {
    if (!this.preferredGenders || this.preferredGenders.length === 0) {
      return '';
    }

    return this.preferredGenders
      .map(gender => {
        switch (gender.gender) {
          case GenderEnum.Male:
            return this.translocoService.translate(
              'eventDetailPageComponent.male',
            );
          case GenderEnum.Female:
            return this.translocoService.translate(
              'eventDetailPageComponent.female',
            );
          case GenderEnum.Diverse:
            return this.translocoService.translate(
              'eventDetailPageComponent.diverse',
            );
        }
      })
      .join(', ');
  }

  getDate(dateAndTime: string): string {
    if (!dateAndTime) return '';
    const date = new Date(dateAndTime);
    return date.toISOString().split('T')[0];
  }

  getTime(dateAndTime: string): string {
    if (!dateAndTime) return '';
    const date = new Date(dateAndTime);
    return date.toISOString().split('T')[1].substring(0, 5);
  }
}
