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
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { CityService } from '../../services/city/city.service';

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
    SliderModule,
    CalendarModule,
  ],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {
  constructor(
    public eventService: EventService,
    private readonly tagService: TagService,
    private readonly cityService: CityService,
    private translocoService: TranslocoService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.setCalenderFormat();
  }
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
  fetchedCities: string[] = [];
  formErrors: { [key: string]: string } = {};
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setFullYear(2099));
  dateFormat: string = 'yy/MM/dd';
  firstDayOfWeek: number = 0;

  form: FormGroup = new FormGroup({
    tags: new FormControl<number[]>([]),
    cities: new FormControl<string[]>([]),
    title: new FormControl<string>(''),
    genders: new FormControl<number[]>([1, 2, 3]),
    categories: new FormControl<number[]>([]),
    dates: new FormControl<Date[]>([]),
    ageRange: new FormControl<number[]>([16, 99]),
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
    this.setCalenderFormat();

    this.activeRoute.queryParams.subscribe(queryParams => {
      this.addFormValues(this.form, queryParams);
    });
  }

  private setCalenderFormat(): void {
    const activeLang = this.translocoService.getActiveLang();

    if (activeLang === 'us') {
      this.firstDayOfWeek = 0; // Sunday
      this.dateFormat = 'mm/dd/yy';
    } else {
      this.firstDayOfWeek = 1; // Monday
      this.dateFormat = 'dd.mm.yy';
    }
  }

  private addFormValues(form: FormGroup, queryParams: Params) {
    Object.keys(queryParams).forEach(key => {
      if (key === 'minAge' || key === 'maxAge') {
        const currentAgeRange = form.get('ageRange')?.value ?? [16, 99];
        if (key === 'minAge') {
          currentAgeRange[0] = Number(queryParams[key]) || 16;
        }
        if (key === 'maxAge') {
          currentAgeRange[1] = Number(queryParams[key]) || 99;
        }
        form.get('ageRange')?.setValue(currentAgeRange);
      } else if (
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
      } else if (form.controls[key] && key === 'dates') {
        const arr: Date[] = [];
        for (const k of queryParams[key]) {
          const date = new Date(k);
          arr.push(date);
        }
        form.controls[key].setValue(arr);
      } else if (
        form.controls[key] &&
        (key === 'genders' || key === 'categories')
      ) {
        const arr: number[] = [];

        if (Array.isArray(queryParams[key])) {
          for (const k of queryParams[key]) {
            arr.push(Number(k));
          }
        } else {
          arr.push(Number(queryParams[key]));
        }

        form.controls[key].setValue(arr);
      } else if (
        Array.isArray(form.controls[key].value) &&
        !Array.isArray(queryParams[key])
      ) {
        form.controls[key].setValue([queryParams[key]]);
      } else if (form.controls[key]) {
        form.controls[key].setValue(queryParams[key]);
      }
    });
    return form;
  }

  validateForm(form: FormGroup): {
    valid: boolean;
    errors: { [key: string]: string };
  } {
    const errors: { [key: string]: string } = {};

    if (
      !form.controls['genders'].value ||
      form.controls['genders'].value.length === 0
    ) {
      errors['genders'] = 'Genders cannot be empty.';
    }

    if (!form.controls['isOnline'].value && !form.controls['isInPlace'].value) {
      errors['isOnlineInPlace'] =
        'At least one of "isOnline" or "isInPlace" must be true.';
    }

    if (
      !form.controls['isPublic'].value &&
      !form.controls['isHalfPublic'].value
    ) {
      errors['isPublicHalfPublic'] =
        'At least one of "isPublic" or "isHalfPublic" must be true.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  submit = () => {
    const validation = this.validateForm(this.form);

    if (!validation.valid) {
      this.formErrors = validation.errors;
      console.log('Form is invalid:', validation.errors);
      return;
    }
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

  private loadCategories() {
    this.eventService.getCategories().subscribe({
      next: data => (this.fetchedCategories = data),
      error: error => console.error('Error loading categories:', error),
    });
  }

  protected onAgeChange(index: number, value: any): void {
    const valueString = value.target.value.toString().trim();

    if (valueString === '') {
      const currentAgeRange = this.form.get('ageRange')?.value ?? [16, 99];
      currentAgeRange[index] = undefined;
      this.form.get('ageRange')?.setValue(currentAgeRange);
      return;
    }

    const numericValue = Number(valueString);

    if (isNaN(numericValue)) {
      return;
    }

    const currentAgeRange = this.form.get('ageRange')?.value ?? [16, 99];
    currentAgeRange[index] = numericValue;
    this.form.get('ageRange')?.setValue(currentAgeRange);
  }

  protected onAgeBlur(index: number, e: any): void {
    const currentAgeRange = this.form.get('ageRange')?.value ?? [16, 99];
    const currentValue = Number(e.target.value.toString().trim());

    if (currentValue === undefined || currentValue === null) {
      currentAgeRange[index] = index === 0 ? 16 : 99;
    } else {
      const numericValue = Number(currentValue);

      if (!isNaN(numericValue)) {
        if (index === 0) {
          currentAgeRange[0] = Math.max(
            16,
            Math.min(numericValue, currentAgeRange[1] ?? 99),
          );
        } else if (index === 1) {
          currentAgeRange[1] = Math.min(
            99,
            Math.max(numericValue, currentAgeRange[0] ?? 16),
          );
        }

        if (currentAgeRange[0] > currentAgeRange[1]) {
          currentAgeRange[1] = currentAgeRange[0];
        }
      }
    }

    this.form.get('ageRange')?.setValue(currentAgeRange);
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

  searchCities(event: any): void {
    const query = event.query.toLowerCase();

    this.cityService.getCities(undefined, query).subscribe({
      next: fetchedCities => {
        this.fetchedCities = Array.from(
          new Set(fetchedCities.map(city => city.name)),
        );
      },
      error: error => {
        console.error('Error fetching cities:', error);
        this.fetchedCities = [];
      },
    });
  }
}
