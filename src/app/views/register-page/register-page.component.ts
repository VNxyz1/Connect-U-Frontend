import {Component} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {minAgeValidator, passwordMatchValidator} from '../../utils/validators/validators';
import {AuthService} from '../../services/auth/auth.service';
import {CalendarModule} from 'primeng/calendar';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import { RegisterBody } from '../../services/auth/auth.service';

type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthday: FormControl<string>;
  gender: FormControl<number>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
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
    CheckboxModule
  ],
  providers: [AuthService, MessageService],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  genderOptions = [
    {label: 'Männlich', value: 1},
    {label: 'Weiblich', value: 2},
    {label: 'Divers', value: 3}
  ];
  protected passwordVisible: boolean | undefined;
  protected passwordRegVisible: boolean | undefined;

  form: RegisterForm = new FormGroup(
    {
      username: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      birthday: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, minAgeValidator(16)]
      }),
      gender: new FormControl( 0 , {
        nonNullable: true,
        validators: [Validators.required]
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      agb: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    {validators: passwordMatchValidator('password', 'confirmPassword')}
  );

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {
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

    const formattedBirthday = new Date(this.form.controls.birthday.value).toISOString().split('T')[0];
      const requestBody: RegisterBody = {
        username: formValue.username !== undefined ? formValue.username : '',
        email: formValue.email !== undefined ? formValue.email : '',
        firstName: formValue.firstName !== undefined ? formValue.firstName : '',
        lastName: formValue.lastName !== undefined ? formValue.lastName : '',
        birthday: formattedBirthday,
        gender: formValue.gender !== undefined ? formValue.gender : 0,
        password: formValue.password !== undefined ? formValue.password : '',
        confirmPassword: formValue.confirmPassword !== undefined ? formValue.confirmPassword : '',
        agb: formValue.agb !== undefined ? formValue.agb : false,
      }

    console.log(typeof(requestBody));
    this.authService.register(
    requestBody
    ).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: err => {
        console.log('Fehlerstatus', err.status);
        this.showErrorMessage(err.status);
      },
    })
  }

  showErrorMessage(code: number): void {
    switch (code) {
      case 404:
        this.messageService.add({
          severity: 'error',
          summary: 'Registrierung fehlgeschlagen',
          detail: 'Es wurden nicht alle Felder ausgefüllt',
        });
        break;
      case 400:
        this.messageService.add({
          severity: 'error',
          summary: 'Registrierung fehlgeschlagen',
          detail: 'Etwas ist schiefgelaufen'
        })
    }
  }

  //protected readonly passwordMatchValidator = passwordMatchValidator;
  //protected readonly minAgeValidator = minAgeValidator;
  protected readonly require = require;

}

/*
,
      agb: new FormControl('',{
        nonNullable: true,
        validators: [Validators.required]
      }),
 */
