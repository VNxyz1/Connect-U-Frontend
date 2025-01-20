import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { EventSearchService } from '../../services/event/event-search.service';
import { Observable, tap } from 'rxjs';
import { EventCardItem } from '../../interfaces/EventCardItem';
import { map } from 'rxjs/operators';
import { Button } from 'primeng/button';
import { AsyncPipe } from '@angular/common';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { PaginatorModule } from 'primeng/paginator';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { ScrollNearEndDirective } from '../../utils/scroll-near-end.directive';
import { SearchParams } from '../../interfaces/SearchParams';

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
  isLoading = false;
  totalCount$!: Observable<number>;
  events$!: Observable<EventCardItem[]>;
  hasMoreEvents$!: Observable<boolean>;
  params!: Params;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventSearchService: EventSearchService,
  ) {}

  ngOnInit(): void {
    this.eventSearchService.resetService();
    this.totalCount$ = this.eventSearchService.getTotalEventsCount();
    this.route.queryParams.subscribe(params => {
      this.params = params;
      this.eventSearchService.initSearchParams(params as SearchParams);
    });

    this.fetchFilteredEvents();
  }

  fetchFilteredEvents(): void {
    this.events$ = this.eventSearchService.getFilteredEvents().pipe(
      map(data => data.events),
      tap(() => (this.isLoading = false)),
    );
    this.hasMoreEvents$ = this.eventSearchService
      .getFilteredEvents()
      .pipe(map(data => data.hasMore));
  }

  loadNewPage(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.eventSearchService.loadNextPage();
  }

  submit = () => {
    this.router.navigate(['search'], { queryParams: this.params });
  };
}
