import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [CardModule, AngularRemixIconComponent, RouterLink, TranslocoPipe],
  templateUrl: './information-page.component.html',
})
export class InformationPageComponent {}
