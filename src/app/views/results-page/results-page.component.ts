import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { EventSearchService } from '../../services/event/event-search.service';
import { Observable, of, tap, throwError } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { catchError, map } from 'rxjs/operators';
import { Button } from 'primeng/button';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { PaginatorModule } from 'primeng/paginator';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { ScrollNearEndDirective } from '../../utils/scroll-near-end.directive';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    PaginatorModule,
    Button,
    AsyncPipe,
    AngularRemixIconComponent,
    TranslocoPipe,
    EventCardComponent,
    RouterOutlet,
    ScrollNearEndDirective,
  ],
  templateUrl: './results-page.component.html',
})
export class ResultsPageComponent implements OnInit {
  loading = true;
  isLoading = false;
  totalCount: number = 0;
  page: number = 1;
  events$!: Observable<EventCardItem[]>;
  hasMoreEvents$!: Observable<boolean>;
  params: Params = { page: 1 };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventSearchService: EventSearchService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fetchFilteredEvents(params);
      this.params = params;
    });
  }

  fetchFilteredEvents(params: any): void {
    this.loading = true;
    this.isLoading = true;

    this.events$ = this.eventSearchService.getFilteredEvents(params).pipe(
      tap(({ totalCount }) => {
        this.totalCount = totalCount;
        this.loading = false;
        this.isLoading = false;
      }),
      map(({ events }) => events),
      catchError((error: any) => {
        console.error('Error fetching filtered events:', error);
        this.loading = false;
        this.isLoading = false;
        return throwError(() => error);
      }),
    );

    this.hasMoreEvents$ = this.eventSearchService
      .getFilteredEvents(params)
      .pipe(map(data => data.totalCount > this.page * 12));
  }

  loadNewPage(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.page++;
    const updatedParams = { ...this.params, page: this.page };
    this.fetchFilteredEvents(updatedParams);
  }

  submit = () => {
    this.router.navigate(['search'], { queryParams: this.params });
  };
}
