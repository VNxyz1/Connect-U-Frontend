import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    CardModule,
    RouterLink,
    LanguageSelectorComponent,
  ],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {}
