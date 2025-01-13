import { Component } from '@angular/core';
import { WebcamModule } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [WebcamModule,],
  templateUrl: './camera.component.html',
})
export class CameraComponent {

}
