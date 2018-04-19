import {ActivatedRoute, CanActivate, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserSettingsGuard implements CanActivate {
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
          subject.next(true);
        } else {
          this.router.navigate(['authorization'], { relativeTo: this.route });
          subject.next(false);
        }
      }, error => {
        this.router.navigate(['authorization'], { relativeTo: this.route });
        subject.next(false);
      });
    return subject.asObservable();
  }
}
