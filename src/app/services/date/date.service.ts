import { Injectable } from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private translocoService: TranslocoService) { }

  formatDateForLocale(date: string | Date): string {
    const activeLang = this.translocoService.getActiveLang();
    const locale = activeLang === 'de' ? 'de-DE' : 'en-US';

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    // Formatierungsoptionen
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
  }
  getCalendarDateFormat(): string {
    const activeLang = this.translocoService.getActiveLang();
    return activeLang === 'de' ? 'dd.mm.yy' : 'mm/dd/yy';
  }
}
