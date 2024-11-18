import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { EventService } from '../../../services/event/eventservice';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgClass, NgIf } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

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
    NgIf,
    NgClass,
    TooltipModule,
  ],
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  eventType: number | undefined = 1;
  eventTitle: string = '';
  description: string = '';
  categories: { id: number; name: string }[] = [];
  selectedCategories: number[] = [];
  submitted: boolean = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    public eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef
  ) {
    // Listen to router events to reapply form data on navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
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
    this.eventService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => (this.categories = data),
        error: (error) => console.error('Error loading categories:', error),
      });
  }

  private async insertValuesAgain() {
    try {
      const savedData = await this.eventService.getEventInformation();
      this.eventType = savedData.type || 1;
      this.eventTitle = savedData.title || '';
      this.description = savedData.description || '';
      this.selectedCategories = savedData.categories || [];

      // Manually trigger change detection
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  protected onCategoryChange() {
    if (this.selectedCategories.length > 3) {
      this.selectedCategories.pop(); // Remove last category if limit exceeded
      this.messageService.add({
        severity: 'warn',
        summary: 'Selection Limit',
        detail: 'You can select up to 3 categories only.',
        life: 3000
      });
    }
  }

  protected async nextPage() {
    this.submitted = true;

    if (!this.eventTitle.trim() || this.eventTitle.length > 50 || !this.selectedCategories?.length) {
      return; // Prevent navigation if validation fails
    }

    try {
      // Save data to the service before navigating
      await this.eventService.setEventInformation({
        type: this.eventType,
        title: this.eventTitle,
        categories: this.selectedCategories,
        description: this.description,
      });

      // Navigate to the next step
      this.router.navigate(['../step2'], { relativeTo: this.route });
    } catch (error) {
      console.error('Error saving event information or navigating:', error);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
