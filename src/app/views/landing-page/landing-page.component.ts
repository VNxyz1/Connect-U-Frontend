import { Component } from '@angular/core';
import {ImageModule} from 'primeng/image';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
    imports: [
        ImageModule,
        RouterOutlet
    ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {

}
