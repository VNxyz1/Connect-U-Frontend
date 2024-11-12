import { Component } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PrimeTemplate } from 'primeng/api';
import { EventService } from '../../../services/event/eventservice';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    DropdownModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    PrimeTemplate,
    FormsModule,
  ],
  providers: [EventService],
  templateUrl: './step1.component.html',
})
export class Step1Component {
  step1: any;

  eventTitle: string | undefined;
  description: string | undefined;
  categories: string[] | undefined;
  selectedCategories: string | undefined;

  constructor(public eventService: EventService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {

  }

  nextPage() {
    if (this.eventTitle && this.selectedCategories && this.description) {
      // Update the service data
      this.eventService.eventInformation.step1 = {
        title: this.eventTitle,
        category: this.selectedCategories,
        description: this.description
      };

      // Navigate to the next step
      this.router.navigate(['../step2'], { relativeTo: this.route });
    }
  }
}
