import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  CreateListBody,
  ListService,
} from '../../../../services/lists/list.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

type CreateListForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
}>;

@Component({
  selector: 'app-create-list',
  standalone: true,
  imports: [
    Button,
    TranslocoPipe,
    DialogModule,
    FloatLabelModule,
    PaginatorModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
  ],
  templateUrl: './create-list.component.html',
})
export class CreateListComponent implements OnInit {
  eventId!: string;

  private _visible: boolean = false;
  submitted: boolean = false;

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    if (!value) {
      this.form.reset();
      this.submitted = false;
    }
    this._visible = value;
  }

  form: CreateListForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  constructor(
    private listService: ListService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
  }

  showDialog() {
    this.visible = true;
  }

  submit() {
    this.submitted = true;

    if (this.form.valid) {
      const body: CreateListBody = {
        title: this.form.value.title || '',
        description: this.form.value.description,
      };

      this.listService.postNewList(this.eventId, body).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'eventListPage.createListModal.messages.success.summary',
            ),
            detail: this.translocoService.translate(
              'eventListPage.createListModal.messages.success.detail',
              { name: body.title },
            ),
          });
          this.visible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'eventListPage.createListModal.messages.error.summary',
            ),
            detail: this.translocoService.translate(
              'eventListPage.createListModal.messages.error.detail',
            ),
          });
        },
      });
    }
  }

  showError(formControl: string): boolean | undefined {
    const invalid = this.form.get(formControl)?.invalid;
    return invalid && this.submitted;
  }
  showNgInvalid(formControl: string): boolean | undefined {
    const invalid = this.form.get(formControl)?.invalid;
    const touched = this.form.get(formControl)?.touched;
    return invalid && touched;
  }
}
