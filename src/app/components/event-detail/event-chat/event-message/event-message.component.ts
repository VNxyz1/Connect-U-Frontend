import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { EventMessage } from '../../../../interfaces/Messages';
import { TranslocoPipe } from '@jsverse/transloco';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { PrimeTemplate } from 'primeng/api';
import { NgClass } from '@angular/common';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

@Component({
  selector: 'app-event-message',
  standalone: true,
  imports: [
    AvatarModule,
    TranslocoPipe,
    AngularRemixIconComponent,
    PrimeTemplate,
    NgClass,
    TranslocoDatePipe,
  ],
  templateUrl: './event-message.component.html',
})
export class EventMessageComponent implements OnInit {
  @Input() message!: EventMessage;

  ngOnInit(): void {
    console.log(this.message);
  }
}
