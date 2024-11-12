import { Component } from '@angular/core';
import { EventService } from '../../../services/event/eventservice';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    SliderModule,
  ],
  providers: [EventService],
  templateUrl: './step3.component.html',
})
export class Step3Component {
  step3: any;

  participantsNumber: number | undefined;
  participantsOptions: string[] | undefined;
  selectedParticipants: string[] | undefined;
  genderOptions: string[] | undefined;
  selectedGenders: any;
  ageValues: number[] = [16, 99];


  constructor(public eventService: EventService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.step3 = this.eventService.getEventInformation().step3;
  }

  complete() {
    this.eventService.eventInformation.step3 = this.step3;
    this.eventService.complete();
  }

  prevPage() {
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }
}
