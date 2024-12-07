import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AngularRemixIconComponent, CardModule, TranslocoPipe, RouterLink],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {}
