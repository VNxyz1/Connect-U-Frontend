import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { async, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventService } from '../../services/event/eventservice';
import { EventDetails } from '../../interfaces/EventDetails';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { EventtypeEnum } from '../../interfaces/EventtypeEnum';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { Gender, GenderEnum } from '../../interfaces/Gender';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { EventRequestService } from '../../services/event/event-request/event-request.service';

@Component({
  selector: 'app-event-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  imports: [
    ToastModule,
    RouterOutlet,
    TabMenuModule,
    EventInfoComponent,
    AsyncPipe,
    AngularRemixIconComponent,
  ],
})
export class EventPageComponent implements OnInit {
  eventId!: string;
  eventDetails!: EventDetails; // Resolved event details
  eventDetails$!: Observable<EventDetails>;
  eventTabMenuItems: MenuItem[] = [];
  activeTabItem: MenuItem | undefined;
  protected isHost = false;
  protected isGuest = false;
  protected hasRequest = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly translocoService: TranslocoService,
    protected readonly messageService: MessageService,
    protected readonly eventRequestService: EventRequestService
  ) {
    if ((this.eventDetails && this.isHost) || this.isGuest) {
      this.setupTabs();
    }
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    if (this.eventId) {
      this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
        catchError(err => {
          this.router.navigate(['/404']);
          return throwError(() => err);
        }),
      );

      // Subscribe to resolve details
      this.eventDetails$.subscribe(async details => {
        this.eventDetails = details; // Store resolved details
        this.isHost = true; //TODO eventdetails.isHost
        this.isGuest = false; //TODO eventDetails.isGuest
        this.hasRequest = false; //TODO requestDB.hasRequest

        if (this.isHost || this.isGuest) {
          await this.setupTabs();
        }
      });
    }
  }

  private setupTabs(): void {
    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.eventTabMenuItems = [
          {
            label: translations['eventPageComponent.infoTab'],
            route: `/event/${this.eventId}`,
            icon: 'folder-info-line',
            state: { eventDetails: this.eventDetails },
            id: 'infoTab',
            command: () => {
              this.activeTabItem = this.eventTabMenuItems[0];
            },
          },
          {
            label: translations['eventPageComponent.listTab'],
            route: `/event/${this.eventId}/lists`,
            icon: 'list-check',
            state: { eventDetails: this.eventDetails },
            id: 'listTab',
            command: () => {
              this.activeTabItem = this.eventTabMenuItems[1];
            },
          },
          {
            label: translations['eventPageComponent.surveyTab'],
            route: `/event/${this.eventId}/surveys`,
            icon: 'chat-poll-line',
            state: { eventDetails: this.eventDetails },
            id: 'surveyTab',
            command: () => {
              this.activeTabItem = this.eventTabMenuItems[2];
            },
          },
        ];

        // Set the initial active tab
        this.activeTabItem = this.eventTabMenuItems[0];
      });
  }

  getPreferredGendersString = (preferredGenders: Gender[]): string => {
    if (!preferredGenders || preferredGenders.length === 0) {
      return this.translocoService.translate(
        'eventDetailPageComponent.noPreferredGenders',
      );
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
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  };

}
