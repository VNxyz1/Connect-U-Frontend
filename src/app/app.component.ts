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
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, NgClass],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Connect-U-Frontend';
  private storageInitialized = false;
  currentUrl: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly storage: Storage,
    private readonly router: Router,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.init();
      this.initStorage(); // Initialize storage
    }

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
      });

    this.primengConfig.setTranslation({
      accept: 'Ja',
      addRule: 'Regel hinzufügen',
      // (Rest of your PrimeNG translations remain unchanged)
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
