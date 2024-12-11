import {Component,} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {ProgressBarModule} from 'primeng/progressbar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {AvatarModule} from 'primeng/avatar';

@Component({
  selector: 'app-card-survey',
  standalone: true,
  imports: [
    CardModule,
    ButtonDirective,
    ProgressBarModule,
    AvatarGroupModule,
    AvatarModule
  ],
  templateUrl: './card-survey.component.html'
})
export class CardSurveyComponent{
}
