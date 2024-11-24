import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './privacy-policy-page.component.html',
})
export class PrivacyPolicyPageComponent {}
