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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EventSearchService } from '../../services/event/event-search.service';
import { Observable, tap, throwError } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError, map } from 'rxjs/operators';

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
    Button,
    AngularRemixIconComponent,
    TranslocoPipe,
  ],
  templateUrl: './results-page.component.html',
})
export class ResultsPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventSearchService: EventSearchService,
  ) {}

  loading = true;
  totalCount: number = 0;
  events$!: Observable<EventCardItem[]>;
  params: Params = { page: 1 };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fetchFilteredEvents(params);
      this.params = params;
    });
  }

  submit = () => {
    this.router.navigate(['search'], { queryParams: this.params });
  };

  fetchFilteredEvents(params: any): void {
    this.loading = true;

    this.events$ = this.eventSearchService.getFilteredEvents(params).pipe(
      tap(({ totalCount }) => {
        this.totalCount = totalCount;
        this.loading = false;
      }),
      map(({ events }) => events),
      catchError((error: any) => {
        console.error('Error fetching filtered events:', error);
        this.loading = false;
        return throwError(() => error);
      })
    );
  }
}
