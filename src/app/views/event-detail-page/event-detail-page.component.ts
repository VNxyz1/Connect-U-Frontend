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
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

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
    TranslocoDatePipe,
  ],
  templateUrl: './event-detail-page.component.html',
})
export class EventDetailPageComponent implements OnInit {
  eventId!: string;
  eventDetails$!: Observable<EventDetails>;

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
  }

  getPreferredGendersString = (preferredGenders: Gender[]): string => {
    if (!preferredGenders || preferredGenders.length === 0) {
      return '';
    }

    return preferredGenders
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
}
