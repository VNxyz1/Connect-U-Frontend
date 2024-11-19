import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
