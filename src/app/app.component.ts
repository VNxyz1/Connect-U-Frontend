import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { SocketService } from './services/socket/socket.service';
import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { EventService } from './services/event/eventservice';
import { EventRequestService } from './services/event/event-request.service';
import { UserService } from './services/user/user.service';
import { LanguageService } from './services/language/language.service';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { CurrentUrlService } from './services/current-url/current-url.service';

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
  currentUrl$!: Observable<string>;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly storage: Storage,
    private readonly currentUrl: CurrentUrlService,
    private readonly router: Router,

    // Necessary to be initialised here!
    private readonly languageService: LanguageService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  ngOnInit(): void {
    this.currentUrl$ = this.currentUrl.get();

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
        }
        this.isLoggedIn = this.auth.isLoggedIn();
      },
    });
  }


  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
