import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserAuthenticated = signal(false);

  constructor() {}

  signIn() {}

  signOut() {}

  signUp() {}

  refreshToken() {}
}
