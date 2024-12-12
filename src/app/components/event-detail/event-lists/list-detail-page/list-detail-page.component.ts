import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListDetail,
  ListEntry,
  ListService,
} from '../../../../services/lists/list.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Button, ButtonDirective } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CheckboxModule,
    Button,
    AngularRemixIconComponent,
    SkeletonModule,
    NgOptimizedImage,
    InputGroupModule,
    InputTextModule,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './list-detail-page.component.html',
})
export class ListDetailPageComponent implements OnInit {
  @ViewChild('createListEntryInputA') createListEntryInputAElement!: ElementRef;
  @ViewChild('createListEntryInputB') createListEntryInputBElement!: ElementRef;

  @Input()
  set listId(listId: number) {
    this._listId = listId;
  }

  listDetail$!: Observable<ListDetail>;

  _listId!: number;

  createInputVisible: boolean = false;

  form: FormGroup<{ content: FormControl }> = new FormGroup({
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });

  constructor(
    private listService: ListService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.getAndSetListDetails();
  }

  getAndSetListDetails() {
    this.listDetail$ = this.listService.getListDetail(this._listId);
  }

  showCreateInput() {
    this.createInputVisible = true;
    setTimeout(() => {
      this.createListEntryInputAElement.nativeElement.focus();
      this.createListEntryInputBElement.nativeElement.focus();
    }, 20);
  }

  hideCreateInput() {
    this.createInputVisible = false;
    this.form.reset();
  }

  handleClickCreateButton() {
    if (!this.createInputVisible) {
      this.showCreateInput();
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.form.valid) {
      this.createListEntry(this.form.value['content']);
    }
  }

  createListEntry(content: string) {
    this.listService.postListEntry(this._listId, content).subscribe({
      next: () => {
        this.getAndSetListDetails();
        this.form.reset();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'eventListPage.createListEntry.messages.error.summary',
          ),
          detail: this.translocoService.translate(
            'eventListPage.createListEntry.messages.error.detail',
          ),
        });
      },
    });
  }

  handleCheckboxChange(entry: ListEntry) {
    this.listService.assignToListEntry(entry.id).subscribe({
      next: () => {
        this.getAndSetListDetails();
      },
      error: () => {
        this.getAndSetListDetails();
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'eventListPage.listEntry.assignUser.messages.error.summary',
          ),
          detail: this.translocoService.translate(
            'eventListPage.listEntry.assignUser.messages.error.detail',
          ),
        });
      },
    });
  }
}
