import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
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
import { Capacitor } from '@capacitor/core';

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
    EventService,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Connect-U-Frontend';
  isIos = Capacitor.getPlatform() === 'ios';
  isLoggedIn!: Observable<boolean>;
  currentUrl$!: Observable<string>;
  toastBreakpoints: any;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly currentUrl: CurrentUrlService,
    private readonly router: Router,
    private renderer: Renderer2,

    // Necessary to be initialised here!
    private readonly languageService: LanguageService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  ngOnInit(): void {
    if (this.isIos) {
      this.renderer.addClass(document.body, 'ios');
    }

    this.toastBreakpoints = this.isIos
      ? { '920px': { width: '90%', top: '120' } }
      : { '920px': { width: '90%', top: '30' } };

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
