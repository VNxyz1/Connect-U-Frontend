import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { SocketService } from './services/socket/socket.service';
import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { Storage } from '@ionic/storage-angular';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { EventService } from './services/event/eventservice';
import { EventRequestService } from './services/event/event-request/event-request.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastModule,
    HeaderComponent,
    NgClass,
    AsyncPipe,
  ],
  providers: [
    AuthService,
    MessageService,
    TranslocoService,
    EventService,
    EventRequestService,
    UserService,
    ConfirmationService,
    SocketService,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Connect-U-Frontend';
  private storageInitialized = false;
  isLoggedIn!: Observable<boolean>;
  currentUrl: string | undefined = undefined;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly storage: Storage,
    private readonly router: Router,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getUserData().subscribe({
        next: data => {
          this.socket.connectUser(data.id);
        },
        error: err => {
          console.error('Failed to fetch user data:', err);
        },
      });
      this.initStorage(); // Initialize storage
    }

    this.isLoggedIn = this.auth.isLoggedIn();

    this.currentUrl = this.router.url;

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
      });

    this.primengConfig.setTranslation({
      accept: 'Ja',
      addRule: 'Regel hinzufügen',
      am: 'am',
      apply: 'Übernehmen',
      cancel: 'Abbrechen',
      choose: 'Auswählen',
      chooseDate: 'Datum wählen',
      chooseMonth: 'Monat wählen',
      chooseYear: 'Jahr wählen',
      clear: 'Löschen',
      contains: 'Enthält',
      dateAfter: 'Datum ist nach',
      dateBefore: 'Datum ist vor',
      dateFormat: 'dd.mm.yy',
      dateIs: 'Datum ist',
      dateIsNot: 'Datum ist nicht',
      dayNames: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
      ],
      dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
      emptyFilterMessage: 'Keine Ergebnisse gefunden',
      emptyMessage: 'Keine Einträge gefunden',
      emptySearchMessage: 'Keine Ergebnisse gefunden',
      emptySelectionMessage: 'Kein ausgewähltes Element',
      endsWith: 'Endet mit',
      equals: 'Ist gleich',
      fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      firstDayOfWeek: 1,
      gt: 'Größer als',
      gte: 'Größer oder gleich',
      lt: 'Kleiner als',
      lte: 'Kleiner oder gleich',
      matchAll: 'Passt auf alle',
      matchAny: 'Passt auf einige',
      medium: 'Mittel',
      monthNames: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      monthNamesShort: [
        'Jan',
        'Feb',
        'Mär',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez',
      ],
      nextDecade: 'Nächstes Jahrzehnt',
      nextHour: 'Nächste Stunde',
      nextMinute: 'Nächste Minute',
      nextMonth: 'Nächster Monat',
      nextSecond: 'Nächste Sekunde',
      nextYear: 'Nächstes Jahr',
      noFilter: 'Kein Filter',
      notContains: 'Enthält nicht',
      notEquals: 'Ist ungleich',
      passwordPrompt: 'Passwort eingeben',
      pending: 'Ausstehend',
      pm: 'pm',
      prevDecade: 'Vorheriges Jahrzehnt',
      prevHour: 'Vorherige Stunde',
      prevMinute: 'Vorherige Minute',
      prevMonth: 'Vorheriger Monat',
      prevSecond: 'Vorherige Sekunde',
      prevYear: 'Vorheriges Jahr',
      reject: 'Nein',
      removeRule: 'Regel entfernen',
      searchMessage: '{0} Ergebnisse verfügbar',
      selectionMessage: '{0} Elemente ausgewählt',
      startsWith: 'Beginnt mit',
      strong: 'Stark',
      today: 'Heute',
      upload: 'Hochladen',
      weak: 'Schwach',
      weekHeader: 'KW',
      aria: {
        cancelEdit: 'Änderungen abbrechen',
        close: 'Schließen',
        collapseRow: 'Zeile reduziert',
        editRow: 'Zeile bearbeiten',
        expandRow: 'Zeile erweitert',
        falseLabel: 'Falsch',
        filterConstraint: 'Filterbeschränkung',
        filterOperator: 'Filteroperator',
        firstPageLabel: 'Erste Seite',
        gridView: 'Rasteransicht',
        hideFilterMenu: 'Filtermenü ausblenden',
        jumpToPageDropdownLabel: 'Zum Dropdown-Menü springen',
        jumpToPageInputLabel: 'Zum Eingabefeld springen',
        lastPageLabel: 'Letzte Seite',
        listView: 'Listenansicht',
        moveAllToSource: 'Alle zur Quelle bewegen',
        moveAllToTarget: 'Alle zum Ziel bewegen',
        moveBottom: 'Zum Ende bewegen',
        moveDown: 'Nach unten bewegen',
        moveTop: 'Zum Anfang bewegen',
        moveToSource: 'Zur Quelle bewegen',
        moveToTarget: 'Zum Ziel bewegen',
        moveUp: 'Nach oben bewegen',
        navigation: 'Navigation',
        next: 'Nächste',
        nextPageLabel: 'Nächste Seite',
        nullLabel: 'Nicht ausgewählt',
        pageLabel: 'Seite {page}',
        previous: 'Vorherige',
        previousPageLabel: 'Vorherige Seite',
        removeLabel: 'Entfernen',
        rotateLeft: 'Nach links drehen',
        rotateRight: 'Nach rechts drehen',
        rowsPerPageLabel: 'Zeilen pro Seite',
        saveEdit: 'Änderungen speichern',
        scrollTop: 'Nach oben scrollen',
        selectAll: 'Alle Elemente ausgewählt',
        selectRow: 'Zeile ausgewählt',
        showFilterMenu: 'Filtermenü anzeigen',
        slide: 'Folie',
        slideNumber: '{slideNumber}',
        star: '1 Stern',
        stars: '{star} Sterne',
        trueLabel: 'Wahr',
        unselectAll: 'Alle Elemente abgewählt',
        unselectRow: 'Zeile abgewählt',
        zoomImage: 'Bild vergrößern',
        zoomIn: 'Vergrößern',
        zoomOut: 'Verkleinern',
      },
    });
  }

  async initStorage(): Promise<void> {
    try {
      await this.storage.create(); // Creates a storage instance
      this.storageInitialized = true;
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
