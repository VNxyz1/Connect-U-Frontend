import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {RouterLink} from "@angular/router";

type LoginForm =  FormGroup<{   email: FormControl<string | null>,  password: FormControl<string | null> }>;


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
    form: LoginForm = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    })

    submitLogin() {
        console.log(this.form.value);
    }


}
