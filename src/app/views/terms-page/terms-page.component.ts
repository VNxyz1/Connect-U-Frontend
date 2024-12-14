import { Component } from '@angular/core';
import { AgbComponent } from '../../components/register/agb/agb.component';

@Component({
  selector: 'terms-and-conditions-page',
  standalone: true,
  imports: [AgbComponent],
  templateUrl: './terms-page.component.html',
})
export class TermsPageComponent {}
