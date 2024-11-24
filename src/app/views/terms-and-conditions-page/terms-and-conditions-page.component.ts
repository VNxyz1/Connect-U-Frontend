import { Component } from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-terms-and-conditions-page',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
  templateUrl: './terms-and-conditions-page.component.html'
})
export class TermsAndConditionsPageComponent {

}
