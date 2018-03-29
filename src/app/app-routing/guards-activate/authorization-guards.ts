import {CanActivate} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  canActivate(): Observable<boolean> {
    const subject: ReplaySubject<boolean> = new ReplaySubject(1);

    this.authService.getUserLocalData()
      .subscribe(user => {
        if (user && this.authService.checkAuthorization()) {
          this.router.navigate(['chat'], { relativeTo: this.route });
          subject.next(false);
        } else {
          subject.next(true);
        }
      }, error => {
        subject.next(true);
      });
    return subject.asObservable();
  }
}
