import { Component, OnInit } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PrimeTemplate } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventService } from '../../services/event/eventservice';
import { TagService } from '../../services/tags/tag.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { parseToQueryParams } from '../../utils/parsing/parsing';
import { Gender } from '../../interfaces/Gender';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

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
    AsyncPipe,
  ],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {
  constructor(
    public eventService: EventService,
    private readonly tagService: TagService,
    private translocoService: TranslocoService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {}
  fetchedCategories: { id: number; name: string }[] = [];
  fetchedGenders!: Observable<{ label: string; value: number }[]>;
  sortOrderOptions: { value: string; name: string }[] = [
    { name: 'searchPageComponent.sortOrder.newestFirst', value: 'newestFirst' },
    { name: 'searchPageComponent.sortOrder.oldestFirst', value: 'oldestFirst' },
    {
      name: 'searchPageComponent.sortOrder.upcomingNext',
      value: 'upcomingNext',
    },
    {
      name: 'searchPageComponent.sortOrder.upcomingLast',
      value: 'upcomingLast',
    },
    {
      name: 'searchPageComponent.sortOrder.alphabetical_asc',
      value: 'alphabetical_asc',
    },
    {
      name: 'searchPageComponent.sortOrder.alphabetical_desc',
      value: 'alphabetical_desc',
    },
  ];
  fetchedTags: string[] = [];

  form: FormGroup = new FormGroup({
    tags: new FormControl<number[]>([]),
    title: new FormControl<string>(''),
    genders: new FormControl<number[]>([]),
    categories: new FormControl<number[]>([]),
    isOnline: new FormControl<boolean>(true),
    isInPlace: new FormControl<boolean>(true),
    isPublic: new FormControl<boolean>(true),
    isHalfPublic: new FormControl<boolean>(true),
    filterFriends: new FormControl<boolean>(false),
    sortOrder: new FormControl<string>('newestFirst'),
  });

  async ngOnInit() {
    this.loadCategories();
    this.fetchedGenders = this.loadGenders();

    this.activeRoute.queryParams.subscribe(queryParams => {
      this.addFormValues(this.form, queryParams);
    });
  }

  private addFormValues(form: FormGroup, queryParams: Params) {
    Object.keys(queryParams).forEach(key => {
      if (
        Array.isArray(queryParams[key]) &&
        form.controls[key] instanceof FormGroup
      ) {
        const fc = form.controls[key] as FormGroup;
        Object.keys(fc.controls).forEach(k => {
          const contains = queryParams[key].includes(k);
          fc.controls[k].setValue(contains);
        });
      } else if (
        !Array.isArray(queryParams[key]) &&
        form.controls[key] instanceof FormGroup
      ) {
        const fc = form.controls[key] as FormGroup;
        Object.keys(fc.controls).forEach(k => {
          fc.controls[k].setValue(queryParams[key] === k);
        });
      } else if (
        form.controls[key] &&
        typeof form.controls[key].value == 'boolean'
      ) {
        form.controls[key].setValue(JSON.parse(queryParams[key]));
      } else if (form.controls[key] && key == 'genders') {
        const arr: any[] = form.controls[key].value;

        if (Array.isArray(queryParams[key])) {
          for (const k of queryParams[key]) {
            arr.push(Number(k));
          }
        } else {
          arr.push(Number(queryParams[key]));
        }
        form.controls[key].setValue(arr);
      } else if (form.controls[key]) {
        form.controls[key].setValue(queryParams[key]);
      }
    });
    console.log(this.fetchedGenders);
    return form;
  }

  submit = () => {
    const params = parseToQueryParams(this.form);
    this.router.navigate(['search', 'results'], { queryParams: params });
  };

  private loadGenders() {
    return this.eventService.getGenders().pipe(
      map(data => {
        return data.map(gender => {
          return this.getGenderFormValues(gender);
        });
      }),
    );
  }

  private getGenderFormValues(gender: Gender) {
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
  }

  /**
  private mapGenderIdsToLabels(genderIds: number[]): { label: string; value: number }[] {
    return genderIds.map(id => {
      const gender = this.fetchedGenders.find(g => g.value === id);
      return gender ? { label: gender.label, value: id } : null;
    }).filter(g => g !== null) as { label: string; value: number }[];
  }
*/

  private loadCategories() {
    this.eventService.getCategories().subscribe({
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
