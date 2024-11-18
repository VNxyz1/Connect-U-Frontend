import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Button } from 'primeng/button';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink,
    ToastModule,
    TranslocoPipe,
    Button,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: LoginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private translocoService: TranslocoService,
  ) {}

  submitLogin() {
    this.authService
      .logIn({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: err => {
          this.showError(err.status);
        },
      });
  }

  showError(code: number) {
    switch (code) {
      case 401:
      case 404:
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'loginComponent.messages.loginFailed',
          ),
          detail: this.translocoService.translate(
            'loginComponent.messages.loginDataUnknown',
          ),
        });
    }
  }
}
