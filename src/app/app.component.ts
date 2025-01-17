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
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { EventService } from './services/event/eventservice';
import { EventRequestService } from './services/event/event-request.service';
import { UserService } from './services/user/user.service';
import { LanguageService } from './services/language/language.service';

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
    LanguageService,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Connect-U-Frontend';
  isLoggedIn!: Observable<boolean>;
  currentUrl: string | undefined = undefined;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,

    // Necessary to be initialised here!
    private readonly languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
      });

    this.auth.checkBackendHealth().subscribe({
      error: () => this.router.navigate(['/unavailable']),
      next: data => {
        if (!data.ok) {
          this.router.navigate(['/unavailable']);
        } else {
          if (isPlatformBrowser(this.platformId)) {
            this.userService.getUserData().subscribe({
              next: data => {
                this.socket.connectUser(data.id);
              },
              error: err => {
                console.error('Failed to fetch user data:', err);
              },
            });
          }

          this.isLoggedIn = this.auth.isLoggedIn();
        }
      },
    });
  }


  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
