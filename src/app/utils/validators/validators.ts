import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDateString = control.value;
    
    if (!birthDateString) {
      return null;
    }

    // Den String in ein Date-Objekt umwandeln
    const birthDate = new Date(birthDateString);
    const today = new Date();

    // Berechne das Alter
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Prüfe, ob das Alter das Mindestalter erfüllt
    return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    return passwordControl.value === confirmPasswordControl.value
      ? null
      : { passwordsMismatch: true };
  };
}
