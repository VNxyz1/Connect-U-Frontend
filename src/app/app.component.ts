import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { SocketService } from './services/socket/socket.service';
import { isPlatformBrowser } from '@angular/common';
import {AuthService} from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeaderComponent],
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  title = 'Connect-U-Frontend';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private socket: SocketService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.init();
    }
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
