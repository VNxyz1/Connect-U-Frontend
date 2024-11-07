import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  /**
   * to be implemented
   */
  isLoggedIn(): boolean {
    return true;
  }
}
