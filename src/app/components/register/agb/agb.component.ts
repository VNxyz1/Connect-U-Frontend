import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

@Component({
  selector: 'app-agb',
  standalone: true,
  imports: [DialogModule, TranslocoPipe],
  templateUrl: './agb.component.html',
})
export class AgbComponent {
  constructor(protected translocoLocaleService: TranslocoLocaleService) {}
}
