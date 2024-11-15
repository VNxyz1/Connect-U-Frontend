import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDateString = control.value;

    // Wenn kein Wert eingegeben wurde, Validator ignorieren
    if (!birthDateString) {
      return null;
    }

    // Geburtsdatum in ein Date-Objekt konvertieren
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) {
      return { invalidDate: { value: birthDateString } }; // Ungültiges Datum
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Alter berechnen
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Prüfen, ob das Mindestalter erfüllt ist
    return age >= minAge
      ? null
      : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const formGroup = group as FormGroup;
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (!password || !confirmPassword) {
      return null; // Wenn eines der Felder leer ist, wird die Validierung übersprungen.
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: { password, confirmPassword } };
  };
}
