import { Component, EventEmitter, Output, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SocketService } from '../../services/socket/socket.service';

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
    AngularRemixIconComponent,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() toggleView = new EventEmitter<boolean>();

  /**
   * After the successful login the site is navigated to this url.
   * @default '/' navigates to the home-page
   */
  @Input({ required: false }) redirectTo: string | UrlTree = '/';

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

  passwordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private readonly socket: SocketService,
  ) {}

  submitLogin() {
    this.authService
      .logIn({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .subscribe({
        next: () => {
          this.router
            .navigateByUrl(this.redirectTo)
            .then(() => window.location.reload());
        },
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

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleToRegister(): void {
    this.toggleView.emit(false); // Wechselt zur Register-Komponente
  }
}
