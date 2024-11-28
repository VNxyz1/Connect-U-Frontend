import { Component } from '@angular/core';
import {CardModule} from 'primeng/card';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {ProfileCardComponent} from '../../components/profile-card/profile-card.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-space-page',
  standalone: true,
  imports: [
    CardModule,
    AngularRemixIconComponent,
    ProfileCardComponent,
    TranslocoPipe,
    RouterLink
  ],
  templateUrl: './my-space-page.component.html',
})
export class MySpacePageComponent {}
