import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {TranslocoPipe} from '@jsverse/transloco';
import {DialogModule} from 'primeng/dialog';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-surveys',
  standalone: true,
  imports: [
    Button,
    TranslocoPipe,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-surveys.component.html'
})
export class CreateSurveysComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

}
