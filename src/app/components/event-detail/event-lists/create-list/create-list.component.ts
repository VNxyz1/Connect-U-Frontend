import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { TranslocoPipe } from '@jsverse/transloco';
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
export class CreateListComponent {
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
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  showDialog() {
    this.visible = true;
  }

  submit() {
    console.log(this.form.value);
    this.submitted = true;
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
