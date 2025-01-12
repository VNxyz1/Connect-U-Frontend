import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { EventService } from '../../../services/event/eventservice';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagService } from '../../../services/tags/tag.service';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    Button,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    FormsModule,
    RadioButtonModule,
    NgClass,
    TooltipModule,
    TranslocoPipe,
    ChipsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
  ],
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  values: string[] | undefined;
  max = 50;
  tags: string[] = [];
  eventType: number | undefined = 1;
  eventTitle: string = '';
  description: string = '';
  categories: { id: number; name: string }[] = [];
  selectedCategories: number[] = [];
  submitted: boolean = false;
  private readonly unsubscribe$ = new Subject<void>();
  results: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadedFile: File | null = null;
  uploadedImagePreview: string | null = null;

  constructor(
    public eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
    private readonly translocoService: TranslocoService,
    private readonly tagService: TagService,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.insertValuesAgain();
      });
  }

  async ngOnInit() {
    this.loadCategories();
    await this.insertValuesAgain();
  }

  private loadCategories() {
    this.eventService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => (this.categories = data),
        error: error => console.error('Error loading categories:', error),
      });
  }

  private async insertValuesAgain() {
    try {
      const savedData = await this.eventService.getEventCreateInformation();
      const savedImage = await this.eventService.getEventImage();

      this.eventType = savedData.type || 1;
      this.eventTitle = savedData.title || '';
      this.description = savedData.description || '';
      this.selectedCategories = savedData.categories || [];
      this.tags = savedData.tags || [];
      this.uploadedImagePreview = savedImage || null;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  protected onCategoryChange() {
    if (this.selectedCategories.length > 3) {
      this.selectedCategories.pop();
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate(
          'createEventStep1Component.messages.categoryLimitTitle',
        ),
        detail: this.translocoService.translate(
          'createEventStep1Component.messages.categoryLimitDetail',
        ),
        life: 3000,
      });
    }
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

    if (file && allowedFileTypes.includes(file.type)) {
      if (file.size > 5242880) {
        // Max size 5MB
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'createEventStep1Component.errorMessages.sizedErrorTitle'
          ),
          detail:this.translocoService.translate(
            'createEventStep1Component.errorMessages.sizedError'
          ),
        });
        return;
      }

      // Datei als Blob speichern
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;

        try {
          await this.eventService.setEventImage(base64Image);
          this.uploadedImagePreview = base64Image;
        } catch (e) {
          console.error('Fehler beim Speichern des Bildes:', e);
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'createEventStep1Component.errorMessages.couldntBeSavedTitle'
            ),
            detail: this.translocoService.translate(
              this.translocoService.translate(
                'createEventStep1Component.errorMessages.couldntBeSaved'
              )
            ),
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translocoService.translate(
          'createEventStep1Component.errorMessages.wrongFormatTitle',
        ),
        detail: this.translocoService.translate('createEventStep1Component.errorMessages.wrongFormat'),
      });
    }
  }

  protected async nextPage() {
    this.submitted = true;

    if (
      !this.eventTitle.trim() ||
      this.eventTitle.length > 50 ||
      !this.selectedCategories?.length
    ) {
      this.messageService.add({
        severity: 'error',
        summary: this.translocoService.translate(
          'createEventStep1Component.messages.validationFailedTitle',
        ),
        detail: this.translocoService.translate(
          'createEventStep1Component.messages.validationFailedDetail',
        ),
      });
      return;
    }

    try {
      await this.eventService.setEventInformation({
        type: this.eventType,
        title: this.eventTitle,
        tags: this.tags,
        categories: this.selectedCategories,
        description: this.description,
      });

      this.router.navigate(['../step2'], { relativeTo: this.route });
    } catch (error) {
      console.error('Error saving event information or navigating:', error);
    }
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

  onKeyUp(event: KeyboardEvent) {
    const triggerKeys = ['Enter', ' ', ','];
    if (triggerKeys.includes(event.key)) {
      let tokenInput = event.target as HTMLInputElement;
      if (tokenInput.value) {
        let tagValue = tokenInput.value.trim().replace(/,$/, '');

        const tagsToAdd: string[] = tagValue
          .split(/[\s,]+/)
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);

        tagsToAdd.forEach(tag => {
          if (!this.tags.includes(tag)) {
            this.tags.push(tag);
          }
        });

        tokenInput.value = '';
      }
    }
  }
  removeImage(): void {
    this.uploadedImagePreview = null;
    this.uploadedFile = null;
    this.messageService.add({
      severity: 'info',
      summary: this.translocoService.translate(
        'createEventStep1Component.messages.removedImageTitle',
      ),
      detail: this.translocoService.translate(
        'createEventStep1Component.messages.removedImage',
      ),
    });
  }

  blurTagInput() {
    this.results = [];
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
