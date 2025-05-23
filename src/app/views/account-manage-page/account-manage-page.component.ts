import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  UpdateAccountBody,
  UpdatePasswordBody,
  UserService,
} from '../../services/user/user.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CityService } from '../../services/city/city.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-account-manage-page',
  standalone: true,
  templateUrl: './account-manage-page.component.html',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    Button,
    DialogModule,
    DropdownModule,
    TranslocoPipe,
    PasswordModule,
    AngularRemixIconComponent,
    ToastModule,
    TooltipModule,
    AutoCompleteModule,
  ],
})
export class AccountManagePageComponent implements OnInit {
  accountForm!: FormGroup;
  passwordForm!: FormGroup;
  fetchedCities: string[] = [];
  passwordModalVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  initForms(): void {
    this.accountForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      gender: new FormControl(''),
      street: new FormControl('', []),
      streetNumber: new FormControl('', []),
      zipCode: new FormControl('', []),
      city: new FormControl('', []),
    });

    this.accountForm.setValidators(this.addressValidation());

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      newPasswordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  loadUserData(): void {
    this.userService.getUserData().subscribe(data => {
      const genderMap: { [key: number]: string } = {
        1: this.translocoService.translate('accountPage.genderOptions.man'),
        2: this.translocoService.translate('accountPage.genderOptions.female'),
        3: this.translocoService.translate('accountPage.genderOptions.diverse'),
      };

      const genderLabel = genderMap[data.gender] || '';

      this.accountForm.patchValue({
        ...data,
        gender: genderLabel,
      });
      this.accountForm.patchValue({
        street: data.street,
        streetNumber: data.streetNumber,
        zipCode: data.zipCode,
        city: data.city,
      });
    });
  }

  submitAccountUpdate(): void {
    if (this.accountForm.valid) {
      const formData = this.accountForm.value;

      const updateData: UpdateAccountBody = {
        firstName: formData.firstName !== undefined ? formData.firstName : '',
        lastName: formData.lastName !== undefined ? formData.lastName : '',
        username: formData.username !== undefined ? formData.username : '',
        email: formData.email !== undefined ? formData.email : '',
        city: formData.city !== undefined ? formData.city : '',
        streetNumber:
          formData.streetNumber !== undefined ? formData.streetNumber : '',
        street: formData.street !== undefined ? formData.street : '',
        zipCode: formData.zipCode !== undefined ? formData.zipCode : '',
      };

      this.userService.updateAccountInformation(updateData).subscribe({
        next: () => {
          this.loadUserData();
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'accountPage.messages.success',
            ),
            detail: this.translocoService.translate(
              'accountPage.messages.detailProfile',
            ),
          });
        },
        error: err => {
          let detailMessage = this.translocoService.translate('');
          if (err.status === 400) {
            if (err.error.message === 'username is already taken') {
              detailMessage = this.translocoService.translate(
                'accountPage.messages.usernameTaken',
              );
            } else if (
              err.error.message === 'e-mail address is already taken'
            ) {
              detailMessage = this.translocoService.translate(
                'accountPage.messages.emailTaken',
              );
            }
          }
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'accountPage.messages.error',
            ),
            detail: detailMessage,
          });
          console.error('Backend error:', err);
        },
      });
    }
  }

  submitPasswordChange(): void {
    const formValue = this.passwordForm.value;
    if (this.passwordForm.valid) {
      const oldPassword =
        formValue.oldPassword !== undefined ? formValue.oldPassword : '';
      const newPassword =
        formValue.newPassword !== undefined ? formValue.newPassword : '';
      const newPasswordConfirm =
        formValue.newPasswordConfirm !== undefined
          ? formValue.newPasswordConfirm
          : '';
      if (newPassword !== newPasswordConfirm) {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'accountPage.passwordForm.errorTitle',
          ),
          detail: this.translocoService.translate(
            'accountPage.passwordForm.missMatchError',
          ),
        });
        return;
      }

      const updatePassword: UpdatePasswordBody = {
        oldPassword,
        newPassword,
        newPasswordConfirm,
      };

      this.userService.updatePassword(updatePassword).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'accountPage.messages.success',
            ),
            detail: this.translocoService.translate(
              'accountPage.messages.detailPassword',
            ),
          });
          this.passwordModalVisible = false;
          this.passwordForm.reset();
        },
        error: err => {
          let detailMessage = this.translocoService.translate('');
          if (err.status === 404) {
            if (err.error.message === 'Old password does not match') {
              detailMessage = this.translocoService.translate(
                'accountPage.passwordForm.wrongPassword',
              );
            }
          }
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(
              'accountPage.passwordForm.errorTitle',
            ),
            detail: detailMessage,
          });
          console.error('Error updating password:', err);
        },
      });
    }
  }

  onZipCodeChange(zipCode: string): void {
    if (zipCode && zipCode.length === 5) {
      this.getCityByZipCode(zipCode);
    } else {
      this.accountForm.get('city')?.setValue('');
    }
  }

  getCityByZipCode(zipCode: string): void {
    this.cityService.getCities(zipCode, undefined).subscribe({
      next: fetchedCities => {
        if (fetchedCities && fetchedCities.length > 0) {
          const city = fetchedCities[0];
          this.accountForm.get('city')?.setValue(city.name);
          this.fetchedCities = [city.name];
        } else {
          this.fetchedCities = [];
        }
      },
      error: error => {
        console.error('Error fetching city by zip code:', error);
        this.fetchedCities = [];
      },
    });
  }

  searchCities(event: any): void {
    const query = event.query.toLowerCase();

    this.cityService.getCities(undefined, query).subscribe({
      next: fetchedCities => {
        this.fetchedCities = Array.from(
          new Set(fetchedCities.map(city => city.name)),
        );
      },
      error: error => {
        console.error('Error fetching cities:', error);
        this.fetchedCities = [];
      },
    });
  }

  showPasswordModal(): void {
    this.passwordModalVisible = true;
  }

  addressValidation(): any {
    return (formGroup: FormGroup) => {
      const street = formGroup.get('street')?.value;
      const streetNumber = formGroup.get('streetNumber')?.value;
      const zipCode = formGroup.get('zipCode')?.value;
      const city = formGroup.get('city')?.value;

      const anyFilled = street || streetNumber || zipCode || city;

      if (anyFilled) {
        if (!street) formGroup.get('street')?.setErrors({ required: true });
        if (!streetNumber)
          formGroup.get('streetNumber')?.setErrors({ required: true });
        if (!zipCode) formGroup.get('zipCode')?.setErrors({ required: true });
        if (!city) formGroup.get('city')?.setErrors({ required: true });
      } else {
        ['street', 'streetNumber', 'zipCode', 'city'].forEach(field =>
          formGroup.get(field)?.setErrors(null),
        );
      }
      return null;
    };
  }
}
