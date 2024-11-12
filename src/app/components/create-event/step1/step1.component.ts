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
  ],
  providers: [EventService],
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  eventTitle: string | undefined;
  description: string | undefined;
  categories: { id: number; name: string }[] = [];
  selectedCategories: number[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    // Listen to router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.insertValuesAgain();
      });
  }

  ngOnInit() {
    this.loadCategories();
    this.insertValuesAgain();
  }

  private loadCategories() {
    this.eventService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => (this.categories = data),
        error: (error) => console.error('Error loading categories:', error),
      });
  }

  private insertValuesAgain() {
    // Load existing form data from EventService
    console.log("1");
    const savedData = this.eventService.getEventInformation();
    console.log('Restoring savedData:', savedData);
    this.eventTitle = savedData.title || '';
    this.description = savedData.description || '';
    this.selectedCategories = savedData.categories || [];

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  onCategoryChange(event: any) {
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

  nextPage() {
    // Save data to the service before navigating
    this.eventService.setEventInformation({
      title: this.eventTitle,
      categories: this.selectedCategories,
      description: this.description
    });

    // Navigate to the next step
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
