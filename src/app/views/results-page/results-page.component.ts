import { Component, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSearchService } from '../../services/event/event-search.service';
import { Observable } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    AutoCompleteModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    PaginatorModule,
    RadioButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    EventCardComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
  templateUrl: './results-page.component.html',
})
export class ResultsPageComponent implements OnInit {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private eventSearchService: EventSearchService,
  ) {
  }
  loading = true;
  events$!: Observable<EventCardItem[]>;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fetchFilteredEvents(params);
    });
  }

  fetchFilteredEvents(params: any): void {
    this.loading = true;
    this.events$ = this.eventSearchService.getFilteredEvents(params);
    this.loading = false;
  }
}
