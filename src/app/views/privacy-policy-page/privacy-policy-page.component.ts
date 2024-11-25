import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './privacy-policy-page.component.html',
  styles: `
    a {
      word-break: break-all;
    }
  `,
})
export class PrivacyPolicyPageComponent {}
