import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { SocketService } from './services/socket/socket.service';
import { isPlatformBrowser } from '@angular/common';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Connect-U-Frontend';
  private storageInitialized = false;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly socket: SocketService,
    private readonly storage: Storage,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.init();
      this.initStorage(); // Initialize storage
    }
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
