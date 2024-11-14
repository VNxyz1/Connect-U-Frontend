import {Component} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {RouterLink} from '@angular/router';
import {FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {minAgeValidator, passwordMatchValidator} from '../../utils/validators/validators';

type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  birthdate: FormControl<string>;
  gender: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
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
    Button
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  genderOptions = [
    {label: 'Männlich', value: 'male'},
    {label: 'Weiblich', value: 'female'},
    {label: 'Divers', value: 'diverse'}
  ];
  protected passwordVisible: boolean | undefined;
  protected passwordRegVisible: boolean | undefined;
  passwordValue: string = '';
  proofPasswordValue: string = '';

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
      firstname: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      lastname: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      birthdate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, minAgeValidator(16)]
      }),
      gender: new FormControl('', {
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
      })
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') } // Passwortabgleichs-Validator
  );

  togglePasswordVisibility(val: string): void {
    if (val == 'regPassword') {
      this.passwordRegVisible = !this.passwordRegVisible;
    }
    if (val == 'proofPassword') {
      this.passwordVisible = !this.passwordVisible;
    }
  }
}

