import { Component } from '@angular/core';
import {ImageModule} from 'primeng/image';
import {LoginComponent} from '../../components/login/login.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
    imports: [
        ImageModule,
        LoginComponent
    ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {

}
