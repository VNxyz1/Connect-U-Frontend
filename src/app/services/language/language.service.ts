import { Injectable } from '@angular/core';
import { AvailableLangs, TranslocoService } from '@jsverse/transloco';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

const CountryNames: { [key: string]: string } = {
  DE: 'Deutsch',
  US: 'English (US)',
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
