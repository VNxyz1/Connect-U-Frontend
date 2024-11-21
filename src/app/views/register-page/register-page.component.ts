import { Component } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  minAgeValidator,
  passwordMatchValidator,
} from '../../utils/validators/validators';
import { AuthService } from '../../services/auth/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterBody } from '../../services/auth/auth.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DateService } from '../../services/date/date.service';

type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthday: FormControl<string>;
  gender: FormControl<number>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
  agb: FormControl<boolean>;
}>;

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    DropdownModule,
    RouterLink,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    Button,
    ReactiveFormsModule,
    CalendarModule,
    ToastModule,
    CheckboxModule,
    TranslocoPipe,
  ],
  providers: [AuthService, MessageService, TranslocoService],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  genderOptions: Array<{ label: string; value: number }> = [];
  protected passwordVisible: boolean | undefined;
  protected passwordRegVisible: boolean | undefined;
  protected calendarDateFormat: string = 'yy-mm-dd';
  form: RegisterForm = new FormGroup(
    {
      username: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      birthday: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, minAgeValidator(16)],
      }),
      gender: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      passwordConfirm: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      agb: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private dateService: DateService,
  ) {
    this.calendarDateFormat = this.dateService.getCalendarDateFormat();
    this.loadGenderOptions();
  }

  togglePasswordVisibility(val: string): void {
    if (val == 'regPassword') {
      this.passwordRegVisible = !this.passwordRegVisible;
    }
    if (val == 'proofPassword') {
      this.passwordVisible = !this.passwordVisible;
    }
  }

  submitRegister() {
    const formValue = this.form.value;

    const formattedBirthday = new Date(this.form.controls.birthday.value)
      .toISOString()
      .split('T')[0];
    const requestBody: RegisterBody = {
      username: formValue.username !== undefined ? formValue.username : '',
      email: formValue.email !== undefined ? formValue.email : '',
      firstName: formValue.firstName !== undefined ? formValue.firstName : '',
      lastName: formValue.lastName !== undefined ? formValue.lastName : '',
      birthday: formattedBirthday,
      gender: formValue.gender !== undefined ? formValue.gender : 0,
      password: formValue.password !== undefined ? formValue.password : '',
      passwordConfirm:
        formValue.passwordConfirm !== undefined
          ? formValue.passwordConfirm
          : '',
      agb: formValue.agb !== undefined ? formValue.agb : false,
    };

    this.authService.register(requestBody).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: Error) => {
        // Fehler vom Backend abfangen und anzeigen
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'registerComponent.errorMessages.registerFailed',
          ),
          detail: err.message, // Die Fehlermeldung aus dem Backend
        });
      },
    });
  }

  loadGenderOptions = () => {
    this.translocoService
      .selectTranslateObject('registerComponent.genderOption')
      .subscribe(genderOption => {
        this.genderOptions = [
          { label: genderOption.male, value: 1 },
          { label: genderOption.female, value: 2 },
          { label: genderOption.diverse, value: 3 },
        ];
      });
  };
}
/*
showErrorMessage(code: number) {
    switch (code) {
      case 404:
      case 400:
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'registerComponent.errorMessages.registerFailed',
          ),
          detail: this.translocoService.translate(
            'registerComponent.errorMessages.registerFailedData',
          ),
        });
    }
  }
 */
