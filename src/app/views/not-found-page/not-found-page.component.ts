import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    PrimeTemplate,
    TranslocoPipe,
    RouterLink,
  ],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {}
