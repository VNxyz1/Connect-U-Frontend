import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AngularRemixIconComponent, CardModule, RouterLink, TranslocoPipe],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {}
