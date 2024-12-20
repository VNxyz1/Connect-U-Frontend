import { Injectable } from '@angular/core';
import {
  AvailableLangs,
  Translation,
  TranslocoService,
} from '@jsverse/transloco';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

const CountryNames: { [key: string]: string } = {
  DE: 'Deutsch',
  US: 'English (US)',
};

const PrimeNgLanguage: { [key: string]: Translation } = {
  DE: {
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
  },
  US: {
    accept: 'Yes',
    addRule: 'Add Rule',
    am: 'am',
    apply: 'Apply',
    cancel: 'Cancel',
    choose: 'Select',
    chooseDate: 'Choose Date',
    chooseMonth: 'Choose Month',
    chooseYear: 'Choose Year',
    clear: 'Clear',
    contains: 'Contains',
    dateAfter: 'Date is after',
    dateBefore: 'Date is before',
    dateFormat: 'mm/dd/yy',
    dateIs: 'Date is',
    dateIsNot: 'Date is not',
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    emptyFilterMessage: 'No results found',
    emptyMessage: 'No entries found',
    emptySearchMessage: 'No results found',
    emptySelectionMessage: 'No selected item',
    endsWith: 'Ends with',
    equals: 'Equals',
    fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    firstDayOfWeek: 1,
    gt: 'Greater than',
    gte: 'Greater than or equal to',
    lt: 'Less than',
    lte: 'Less than or equal to',
    matchAll: 'Match all',
    matchAny: 'Match any',
    medium: 'Medium',
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    nextDecade: 'Next decade',
    nextHour: 'Next hour',
    nextMinute: 'Next minute',
    nextMonth: 'Next month',
    nextSecond: 'Next second',
    nextYear: 'Next year',
    noFilter: 'No filter',
    notContains: 'Does not contain',
    notEquals: 'Not equal to',
    passwordPrompt: 'Enter password',
    pending: 'Pending',
    pm: 'pm',
    prevDecade: 'Previous decade',
    prevHour: 'Previous hour',
    prevMinute: 'Previous minute',
    prevMonth: 'Previous month',
    prevSecond: 'Previous second',
    prevYear: 'Previous year',
    reject: 'No',
    removeRule: 'Remove Rule',
    searchMessage: '{0} results available',
    selectionMessage: '{0} items selected',
    startsWith: 'Starts with',
    strong: 'Strong',
    today: 'Today',
    upload: 'Upload',
    weak: 'Weak',
    weekHeader: 'WK',
    aria: {
      cancelEdit: 'Cancel changes',
      close: 'Close',
      collapseRow: 'Row collapsed',
      editRow: 'Edit row',
      expandRow: 'Row expanded',
      falseLabel: 'False',
      filterConstraint: 'Filter constraint',
      filterOperator: 'Filter operator',
      firstPageLabel: 'First page',
      gridView: 'Grid view',
      hideFilterMenu: 'Hide filter menu',
      jumpToPageDropdownLabel: 'Jump to dropdown menu',
      jumpToPageInputLabel: 'Jump to input field',
      lastPageLabel: 'Last page',
      listView: 'List view',
      moveAllToSource: 'Move all to source',
      moveAllToTarget: 'Move all to target',
      moveBottom: 'Move to bottom',
      moveDown: 'Move down',
      moveTop: 'Move to top',
      moveToSource: 'Move to source',
      moveToTarget: 'Move to target',
      moveUp: 'Move up',
      navigation: 'Navigation',
      next: 'Next',
      nextPageLabel: 'Next page',
      nullLabel: 'Not selected',
      pageLabel: 'Page {page}',
      previous: 'Previous',
      previousPageLabel: 'Previous page',
      removeLabel: 'Remove',
      rotateLeft: 'Rotate left',
      rotateRight: 'Rotate right',
      rowsPerPageLabel: 'Rows per page',
      saveEdit: 'Save changes',
      scrollTop: 'Scroll to top',
      selectAll: 'All items selected',
      selectRow: 'Row selected',
      showFilterMenu: 'Show filter menu',
      slide: 'Slide',
      slideNumber: '{slideNumber}',
      star: '1 star',
      stars: '{star} stars',
      trueLabel: 'True',
      unselectAll: 'All items unselected',
      unselectRow: 'Row unselected',
      zoomImage: 'Zoom image',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private LANG_KEY = 'activeLanguage';

  private activeLanguageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  constructor(
    private translocoService: TranslocoService,
    private storage: StorageService,
    private primengConfig: PrimeNGConfig,
  ) {
    this.initActiveLanguage();
  }

  private initActiveLanguage() {
    this.storage.get(this.LANG_KEY).then(storedLang => {
      const initialLang: string =
        (storedLang as string | undefined) ||
        this.translocoService.getActiveLang();
      this.setActiveLanguage(initialLang);
    });
  }

  getActiveLanguage(): Observable<string> {
    return this.activeLanguageSubject.asObservable();
  }

  setActiveLanguage(language: string): void {
    this.translocoService.setActiveLang(language);
    this.storage.set(this.LANG_KEY, language);
    this.activeLanguageSubject.next(language);
    this.primengConfig.setTranslation(
      PrimeNgLanguage[this.getCountryCode(language).toUpperCase()],
    );
  }

  getAvailableLanguages(): AvailableLangs {
    return this.translocoService.getAvailableLangs();
  }

  getCountryCode(language: string): string {
    return language.split('-')[1];
  }

  getFlagLink(countryCode: string) {
    const uppercase = countryCode.toUpperCase();
    return `images/flags/${uppercase}.png`;
  }

  getCountryName = (countryCode: string) => {
    const country = CountryNames[countryCode.toUpperCase()];
    if (!country) {
      return countryCode;
    }
    return country;
  };
}
