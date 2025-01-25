import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ListDetail,
  ListEntry,
  ListService,
} from '../../../../services/lists/list.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from 'primeng/button';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { SocketService } from '../../../../services/socket/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { Capacitor } from '@capacitor/core';

const BadRequestMessages: Record<string, string> = {
  'A list entry with the same description already exists.':
    'eventListPage.createListEntry.messages.similarEntry',
};

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

  private _listDetailSubject$!: BehaviorSubject<ListDetail>;

  listDetail$!: Observable<ListDetail>;
  eventId!: string;
  _listId!: number;
  isIos = Capacitor.getPlatform() === 'ios';

  createInputVisible: boolean = true;

  form: FormGroup<{ content: FormControl }> = new FormGroup({
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });

  constructor(
    private readonly listService: ListService,
    private readonly messageService: MessageService,
    private readonly translocoService: TranslocoService,
    protected readonly userService: UserService,
    private readonly sockets: SocketService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.listService.getListDetail(this._listId).subscribe({
      next: res => {
        this._listDetailSubject$ = new BehaviorSubject<ListDetail>(res);
        this.listDetail$ = this._listDetailSubject$.asObservable();
      },
    });

    this.sockets.on('updateListDetail').subscribe({
      next: () => this.getAndSetListDetails(),
    });
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
    });
  }

  getAndSetListDetails() {
    this.listService.getListDetail(this._listId).subscribe({
      next: res => this._listDetailSubject$.next(res),
    });
  }

  showCreateInput() {
    this.createInputVisible = true;
    setTimeout(() => {
      this.createListEntryInputAElement.nativeElement.focus();
      this.createListEntryInputBElement.nativeElement.focus();
    }, 20);
  }

  /**
   * Can be called during the blur event of the create-input. createInputVisible should be set to false
   */
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
      error: err => {
        this.handleError(err);
      },
    });
  }

  handleError(err: any) {
    const translationKey =
      BadRequestMessages[err.error?.message] ||
      'eventListPage.createListEntry.messages.error';

    this.messageService.add({
      severity: 'error',
      summary: this.translocoService.translate(translationKey + '.summary'),
      detail: this.translocoService.translate(translationKey + '.detail'),
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

  deleteList(listId: number): void {
    this.confirmationService.confirm({
      message: this.translocoService.translate(
        'listPage.deleteListConfirmationMessage',
      ),
      header: this.translocoService.translate(
        'listPage.deleteListConfirmationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.listService.deleteList(listId).subscribe({
          next: () => {
            if (this.eventId) {
              this.router.navigate(['/event/' + this.eventId + '/lists']);
            }
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate(
                'listPage.deleteListSuccessTitle',
              ),
              detail: this.translocoService.translate(
                'listPage.deleteListSuccessMessage',
              ),
            });
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate(
                'listPage.deleteListErrorTitle',
              ),
              detail: this.translocoService.translate(
                'listPage.deleteListErrorMessage',
              ),
            });
            console.error('Error deleting list:', err);
          },
        });
      },
      reject: () => {},
    });
  }

  deleteListEntry(entryId: number): void {
    this.confirmationService.confirm({
      message: this.translocoService.translate(
        'listPage.deleteEntryConfirmationMessage',
      ),
      header: this.translocoService.translate(
        'listPage.deleteEntryConfirmationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (entryId) {
          this.listService.deleteListEntry(entryId).subscribe({
            next: () => {
              this.getAndSetListDetails();
              this.messageService.add({
                severity: 'success',
                summary: this.translocoService.translate(
                  'listPage.deleteEntrySuccessTitle',
                ),
                detail: this.translocoService.translate(
                  'listPage.deleteEntrySuccessMessage',
                ),
              });
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: this.translocoService.translate(
                  'listPage.deleteEntryErrorTitle',
                ),
                detail: this.translocoService.translate(
                  'listPage.deleteEntryErrorMessage',
                ),
              });
              console.error('Error deleting list entry:', err);
            },
          });
        }
      },
      reject: () => {},
    });
  }
}
