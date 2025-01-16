import { FormGroup } from '@angular/forms';
import { Params } from '@angular/router';

export function parseToQueryParams(form: FormGroup) {
  const queryParams: Params = {};
  Object.keys(form.value).forEach(key => {
    const value = form.value[key];

    if (value === '') return;
    if (key === 'ageRange' && Array.isArray(value) && value.length === 2) {
      const [minAge, maxAge] = value;
      if (minAge !== 16) {
        queryParams['minAge'] = minAge;
      }
      if (maxAge !== 99) {
        queryParams['maxAge'] = maxAge;
      }
    } else if (form.controls[key] instanceof FormGroup) {
      queryParams[key] = Object.keys(value).filter(k => value[k]);
    } else if (value instanceof Date) {
      queryParams[key] = value.toISOString();
    } else {
      queryParams[key] = value;
    }
  });

  return queryParams;
}
