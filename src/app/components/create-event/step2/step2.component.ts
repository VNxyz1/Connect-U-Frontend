import { Component } from '@angular/core';
import { EventService } from '../../../services/event/eventservice';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    CalendarModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    RadioButtonModule,
  ],
  providers: [EventService],
  templateUrl: './step2.component.html',
})
export class Step2Component {
  step2: any;

  date: Date | undefined;
  time: Date | undefined;
  online: boolean | false | undefined;
  street: string | undefined;
  hnr:  string | undefined;
  zipCode: string | undefined;
  city: string | undefined;
  hideAdress: boolean | undefined;

  constructor(public eventService: EventService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.step2 = this.eventService.getEventInformation().step2;
  }

  nextPage() {
    if (this.step2.date && this.step2.time) {
      this.step2.eventService.step2 = this.step2;
      this.router.navigate(['../step2'], { relativeTo: this.route });
    }
    return;
  }

  prevPage() {
    this.router.navigate(['../step1'], { relativeTo: this.route });
  }
}
