import { Injectable } from '@angular/core';
import { BehaviorSubject, share, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrentUrlService {
  private readonly currentUrlSubject: Subject<string> =
    new BehaviorSubject<string>('');

  constructor(private readonly router: Router) {
    this.currentUrlSubject.next(this.router.url);
    this.subscribeToUrl();
  }

  get() {
    return this.currentUrlSubject.asObservable().pipe(share());
  }

  private subscribeToUrl() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrlSubject.next(event.url);
      });
  }
}
