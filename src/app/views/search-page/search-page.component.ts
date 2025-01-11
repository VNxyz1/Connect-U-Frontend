import { Component } from '@angular/core';
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
  ],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent {

  constructor(
    public eventService: EventService,
    private readonly tagService: TagService,
    private translocoService: TranslocoService,
  ) {
  }

  tags: string[] = [];
  eventTitle: string = '';
  categories: { id: number; name: string }[] = [];
  genders: { value: number; label: string }[] = [];
  preferredGenders: number[] = [];
  selectedCategories: string[] = [];
  results: string[] = [];
  online: boolean = true;
  offline: boolean = true;
  public:boolean = true;
  halfPublic: boolean = true;
  friends: boolean = false;

  async ngOnInit() {
    this.loadCategories();
    await this.loadGenders();
  }

  private async loadGenders() {
    this.eventService
      .getGenders()
      .subscribe({
        next: data => {
          this.genders = data.map(gender => {
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

  private loadCategories() {
    this.eventService
      .getCategories()
      .subscribe({
        next: data => (this.categories = data),
        error: error => console.error('Error loading categories:', error),
      });
  }

  search(event: any): void {
    const query = event.query.toLowerCase();
    this.tagService.getAllTags(query).subscribe({
      next: tags => (this.results = tags),
      error: error => {
        console.error('Error fetching tags:', error);
        this.results = [];
      },
    });
  }

  submit(): void {}
}

