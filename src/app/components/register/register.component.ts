import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink, UrlTree } from '@angular/router';
import { DateService } from '../../services/date/date.service';
import { AuthService, RegisterBody } from '../../services/auth/auth.service';
import {
  minAgeValidator,
  passwordMatchValidator,
} from '../../utils/validators/validators';
import { AgbComponent } from './agb/agb.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AngularRemixIconComponent } from 'angular-remix-icon';

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
  selector: 'app-register',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    ToastModule,
    TranslocoPipe,
    RouterLink,
    AgbComponent,
    FloatLabelModule,
    PasswordModule,
    AngularRemixIconComponent,
  ],
  providers: [AuthService, MessageService, TranslocoService],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  @Output() toggleView: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * After the successful login the site is navigated to this url.
   * @default '/' navigates to the home-page
   */
  @Input({ required: false }) redirectTo: string | UrlTree = '/';

  genderOptions: Array<{ label: string; value: number }> = [];
  protected calendarDateFormat: string = 'yy-mm-dd';
  form: RegisterForm = new FormGroup(
    {
      username: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      }),
      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(30)],
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
  gtcDialogVisible: boolean = false;

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
      next: () => this.router.navigateByUrl(this.redirectTo),
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

  openGTC() {
    this.gtcDialogVisible = true;
  }
  toggleToLogin(): void {
    this.toggleView.emit(true);
  }
}
