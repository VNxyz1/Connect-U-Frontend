import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-server-unavailable-page',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './server-unavailable-page.component.html',
})
export class ServerUnavailablePageComponent {}
