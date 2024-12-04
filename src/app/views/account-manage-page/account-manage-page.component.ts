import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {TranslocoService} from '@jsverse/transloco';

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

  constructor(private userService: UserService, private translocoService: TranslocoService,) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  initForms(): void {
    this.accountForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
    });

    this.locationForm = new FormGroup({
      street: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
    });

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  loadUserData(): void {
    this.userService.getUserData().subscribe((data) => {
      const genderMap: { [key: number]: string } = {
        1: 'Männlich',
        2: 'Weiblich',
        3: 'Divers',
      };

      // Gender-Label basierend auf der Zahl auswählen
      const genderLabel = genderMap[data.gender] || '';

      // Account-Daten in das Formular einfügen
      this.accountForm.patchValue({
        ...data,
        gender: genderLabel, // Setze das Gender-Label im Formular
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
      this.userService.updateAccountInformation(this.accountForm.value).subscribe(() => {
        console.log('Account updated successfully');
      });
    }
  }

  submitLocationUpdate(): void {
    if (this.locationForm.valid) {
      this.userService.updateAccountInformation(this.locationForm.value).subscribe(() => {
        console.log('Location updated successfully');
      });
    }
  }

  submitPasswordChange(): void {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        console.error('Passwörter stimmen nicht überein.');
        return;
      }
      this.userService.updatePassword({ oldPassword, newPassword, confirmPassword }).subscribe(() => {
        console.log('Password changed successfully');
        this.passwordModalVisible = false;
        this.passwordForm.reset();
      });
    }
  }

  showPasswordModal(): void {
    this.passwordModalVisible = true;
  }
}
