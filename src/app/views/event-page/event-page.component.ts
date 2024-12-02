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


@Component({
  selector: 'app-event-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  providers: [MessageService, EventService],
  imports: [ToastModule, RouterOutlet, TabMenuModule, EventInfoComponent, AsyncPipe, AngularRemixIconComponent],
})
export class EventPageComponent implements OnInit {
  eventId!: string;
  eventDetails!: EventDetails; // Resolved event details
  eventDetails$!: Observable<EventDetails>;
  eventTabMenuItems: MenuItem[] = [];
  activeTabItem: MenuItem | undefined;
  isLoggedIn = false;
  isHost = false;
  isGuest = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    protected readonly translocoService: TranslocoService,
    protected readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    if (this.eventId) {
      console.log('Fetching event details...');
      this.eventDetails$ = this.eventService.getEventDetails(this.eventId).pipe(
        catchError((err) => {
          this.router.navigate(['/404']);
          return throwError(() => err);
        })
      );

      console.log('details Observable created:', this.eventDetails$);

      // Subscribe to resolve details
      this.eventDetails$.subscribe((details) => {
        this.eventDetails = details; // Store resolved details
        this.isHost = true; // Replace with actual data from details when available
        this.isGuest = false; // Replace with actual data from details when available
        this.isLoggedIn = true;

        if (this.isHost || this.isGuest) {
          this.setupTabs();
        }
      });
    }
  }

  private setupTabs(): void {
    this.eventTabMenuItems = [
      {
        label: this.translocoService.translate('eventPageComponent.infoTab'),
        route: `/event/${this.eventId}`,
        icon: 'folder-info-line',
        state: { eventDetails: this.eventDetails }, // Pass resolved details
        id: 'infoTab',
        command: () => { this.activeTabItem = this.eventTabMenuItems[0]}
      },
      {
        label: this.translocoService.translate('eventPageComponent.listTab'),
        route: `/event/${this.eventId}/lists`,
        icon: 'list-check',
        state: { eventDetails: this.eventDetails },
        id: 'listTab',
        command: () => { this.activeTabItem = this.eventTabMenuItems[1]}
      },
      {
        label: this.translocoService.translate('eventPageComponent.surveyTab'),
        route: `/event/${this.eventId}/surveys`,
        icon: 'chat-poll-line',
        state: { eventDetails: this.eventDetails },
        id: 'surveyTab',
        command: () => { this.activeTabItem = this.eventTabMenuItems[2]}
      },
    ];

    // Set the initial active tab
    this.activeTabItem = this.eventTabMenuItems[0];
  }

  getPreferredGendersString = (preferredGenders: Gender[]): string => {
    if (!preferredGenders || preferredGenders.length === 0) {
      return this.translocoService.translate(
        'eventDetailPageComponent.noPreferredGenders'
      );
    }

    return preferredGenders
      .map((gender) => {
        switch (gender.gender) {
          case GenderEnum.Male:
            return this.translocoService.translate(
              'eventDetailPageComponent.male'
            );
          case GenderEnum.Female:
            return this.translocoService.translate(
              'eventDetailPageComponent.female'
            );
          case GenderEnum.Diverse:
            return this.translocoService.translate(
              'eventDetailPageComponent.diverse'
            );
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  };
}
