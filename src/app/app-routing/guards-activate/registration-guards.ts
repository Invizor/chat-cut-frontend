import {CanActivate} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate() {
    const isAuthorization = this.authService.checkAuthorization();
    if (isAuthorization) {
      this.router.navigate(['chat']);
    }
    return !isAuthorization;
  }
}
