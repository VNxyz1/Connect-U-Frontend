import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UpdateAccountBody, UpdatePasswordBody, UserService} from '../../services/user/user.service';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {TranslocoService} from '@jsverse/transloco';
import {MessageService} from 'primeng/api';

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
    DropdownModule
  ]
})
export class AccountManagePageComponent implements OnInit {
  accountForm!: FormGroup;
  locationForm!: FormGroup;
  passwordForm!: FormGroup;

  passwordModalVisible: boolean = false;

  constructor(private messageService:MessageService,private userService: UserService, private translocoService: TranslocoService,) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  initForms(): void {
    this.accountForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.minLength(5)]),
      streetNumber: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.minLength(2)]),
    });

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      newPasswordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  loadUserData(): void {
    this.userService.getUserData().subscribe((data) => {
      const genderMap: { [key: number]: string } = {
        1: 'Männlich',
        2: 'Weiblich',
        3: 'Divers',
      };

      const genderLabel = genderMap[data.gender] || '';

      this.accountForm.patchValue({
        ...data,
        gender: genderLabel,
      });
      this.locationForm.patchValue({
        street: data.street,
        streetNumber: data.streetNumber,
        zipCode: data.zipCode,
        city: data.city,
      });
    });
  }


  submitAccountUpdate(): void {
    if (this.accountForm.valid) {
      const formData = this.accountForm.value

      const updateData: UpdateAccountBody = {
        firstName: formData.firstName !== undefined ? formData.firstName: '',
        lastName: formData.lastName !== undefined ? formData.lastName: '',
        username: formData.username !== undefined ? formData.username: '',
        email: formData.email !== undefined ? formData.email: '',
        city: formData.city !== undefined ? formData.city: '',
        streetNumber: formData.streetNumber !== undefined ? formData.streetNumber: '',
        street: formData.street !== undefined ? formData.street : '',
        zipCode: formData.zipCode !== undefined ? formData.zipCode: '',
      }

      this.userService.updateAccountInformation(updateData).subscribe({
        next: ()=>{
          console.log('update account update');
          this.loadUserData()
        },

      });
    }
  }

  submitPasswordChange(): void {
    const formValue = this.passwordForm.value
    if (this.passwordForm.valid) {

      const oldPassword = formValue.oldPassword !== undefined ? formValue.oldPassword : '';
      const newPassword = formValue.newPassword !== undefined ? formValue.newPassword : '';
      const newPasswordConfirm = formValue.newPasswordConfirm !== undefined ? formValue.newPasswordConfirm : '';

      if (newPassword !== newPasswordConfirm) {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('passwordChange.errorTitle'),
          detail: this.translocoService.translate('passwordChange.mismatchError'),
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
            summary: this.translocoService.translate('passwordChange.successTitle'),
            detail: this.translocoService.translate('passwordChange.successMessage'),
          });
          this.passwordModalVisible = false;
          this.passwordForm.reset();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('passwordChange.errorTitle'),
            detail: err.message || this.translocoService.translate('passwordChange.genericError'),
          });
          console.error('Error updating password:', err);
        },
      });
    }
  }

  showPasswordModal(): void {
    this.passwordModalVisible = true;
  }
}
