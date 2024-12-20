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
