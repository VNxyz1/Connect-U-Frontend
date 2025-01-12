import { Component, OnInit } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import {  PrimeTemplate } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventService } from '../../services/event/eventservice';
import { TagService } from '../../services/tags/tag.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { parseToQueryParams } from '../../utils/parsing/parsing';
import { SortOrder } from '../../interfaces/SearchParams';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    AutoCompleteModule,
    Button,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    PaginatorModule,
    PrimeTemplate,
    RadioButtonModule,
    TranslocoPipe,
    CheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {

  constructor(
    public eventService: EventService,
    private readonly tagService: TagService,
    private translocoService: TranslocoService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }
  fetchedCategories: { id: number; name: string }[] = [];
  fetchedGenders: { value: number; label: string }[] = [];
  fetchedTags: string[] = [];

  form: FormGroup = new FormGroup({
    tags: new FormControl<number[]>([]),
    title: new FormControl<string>(''),
    genders: new FormControl<number[]>([1,2,3]),
    categories: new FormControl<number[]>([]),
    isOnline: new FormControl<boolean>(true),
    isInPlace: new FormControl<boolean>(true),
    isPublic: new FormControl<boolean>(true),
    isHalfPublic: new FormControl<boolean>(true),
    filterFriends: new FormControl<boolean>(false),
    sortOrder: new FormControl<string>(''),
  });

  async ngOnInit() {
    this.loadCategories();
    await this.loadGenders();

    this.activeRoute.queryParams.subscribe(queryParams => {
      this.addFormValues(this.form, queryParams);
    });
  }

  private addFormValues(form: FormGroup, queryParams: Params) {
    Object.keys(queryParams).forEach((key) => {
      if (Array.isArray(queryParams[key]) && form.controls[key] instanceof FormGroup) {
        const fc = form.controls[key] as FormGroup;
        Object.keys(fc.controls).forEach((k) => {
          const contains = queryParams[key].includes(k);
          fc.controls[k].setValue(contains);
        })
      } else if (!Array.isArray(queryParams[key]) && form.controls[key] instanceof FormGroup) {
        const fc = form.controls[key] as FormGroup;
        Object.keys(fc.controls).forEach((k) => {
          fc.controls[k].setValue(queryParams[key] === k);
        })
      } else if (form.controls[key] && typeof form.controls[key].value  == 'boolean')  {
        form.controls[key].setValue(JSON.parse(queryParams[key]));
      } else if (form.controls[key]) {
        form.controls[key].setValue(queryParams[key]);
      }
    })
    console.log(this.form.value);
    return form;
  }

  submit = () => {
      const params = parseToQueryParams(this.form);
      this.router.navigate(['search', 'results'], {queryParams: params});
  }

  private async loadGenders() {
    this.eventService
      .getGenders()
      .subscribe({
        next: data => {
          this.fetchedGenders = data.map(gender => {
            let label = '';
            switch (gender.gender) {
              case 1:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.male',
                );
                break;
              case 2:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.female',
                );
                break;
              case 3:
                label = this.translocoService.translate(
                  'createEventStep3Component.genders.divers',
                );
                break;
            }
            return { label, value: gender.id };
          });
        },
        error: error => console.error('Error loading genders:', error),
      });
  }

  sortOrderOptions = [
    { name: 'Newest First', value: 'newestFirst' },
    { name: 'Oldest First', value: 'oldestFirst' },
    { name: 'Upcoming Next', value: 'upcomingNext' },
    { name: 'Upcoming Last', value: 'upcomingLast' },
    { name: 'Alphabetical (A-Z)', value: 'alphabetical_asc' },
    { name: 'Alphabetical (Z-A)', value: 'alphabetical_desc' },
  ];

  private loadCategories() {
    this.eventService
      .getCategories()
      .subscribe({
        next: data => (this.fetchedCategories = data),
        error: error => console.error('Error loading categories:', error),
      });
  }

  search(event: any): void {
    const query = event.query.toLowerCase();
    this.tagService.getAllTags(query).subscribe({
      next: fetchedTags => (this.fetchedTags = fetchedTags),
      error: error => {
        console.error('Error fetching tags:', error);
        this.fetchedTags = [];
      },
    });
  }
}

