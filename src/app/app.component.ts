import {Component, Inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket/socket.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [],
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
