import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserDTO } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'accessToken';
  private router = inject(Router);

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  preventGuestAccess(): boolean {
    const isLoggedIn = this.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigateByUrl('/login');
    }

    return isLoggedIn;
  }

  preventAuthAccess(): boolean {
    const isLoggedIn = this.isLoggedIn();

    if (isLoggedIn) {
      this.router.navigateByUrl('/');
    }

    return !isLoggedIn;
  }
}
