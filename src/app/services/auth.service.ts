import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { AppSettings } from '../../app-config';
import { User } from '../models/user.model';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: User;
  token = null;

  constructor(
    private apiService: ApiService
  ) {
    this.init();
  }

  private init() {
    if (this.checkToken()) {
      this.getUser()
        .subscribe(user => {
        });
    }
  }

  public checkAuthorization() {
    return Boolean(this.checkToken());
  }

  public getUserLocalData() {
    return this.user;
  }

  public checkToken() {
    const token = this.getToken();
    return Boolean(typeof(token) === 'string' && token.length > 0);
  }

  public getToken() {
    let tokenResult = null;
    if (typeof(this.token) === 'string' && this.token.length > 0) {
      tokenResult = this.token;
    }
    const tokenLS = window.localStorage.getItem('token');
    if (typeof(tokenLS) === 'string' && tokenLS.length > 0) {
      tokenResult = tokenLS;
    }
    return tokenResult;
  }

  public setToken(token) {
    if (typeof(token) === 'string' && token.length > 0) {
      this.token = token;
      window.localStorage.setItem('token', token);
    }
  }

  public validateAuthData(email: string, password: string) {
    let isValid = true;
    const errorObj = {};
    const regexpEmail = new RegExp('^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$');
    const resultTestEmailList = regexpEmail.exec(email);
    let resultTestValue = '';
    if (Array.isArray(resultTestEmailList) && resultTestEmailList.length > 0) {
      resultTestValue = resultTestEmailList[0];
    }

    if (typeof(email) !== 'string' || resultTestValue !== email) {
      isValid = false;
      errorObj['email'] = 'Enter correct email';
    }
    if (typeof(password) !== 'string' || password.length < 8) {
      isValid = false;
      errorObj['password'] = 'Enter correct password: more than 8 characters';
    }
    return {isValid: isValid, errorObj: errorObj};
  }

  public getUser(): Observable<User> {
    const url = AppSettings.API_URL + '/user/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.getToken() || ''
      }),
      params: {}
    };

    return new Observable(observer => {
      this.apiService.get(url, httpOptions)
        .subscribe(data => {
          this.user = data.user;
          observer.next(data.user);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  public registerUser(user: User) {
    const url = AppSettings.API_URL + '/user/register';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.getToken() || ''
      })
    };

    return new Observable(observer => {
      this.apiService.post(url, user, httpOptions)
        .subscribe(userData => {
          this.user = userData ;
          observer.next(userData);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  public loginUser(email: string, password: string) {
    const url = AppSettings.API_URL + '/user/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.getToken() || ''
      })
    };
    const bodyParams = {
      email: email,
      password: password
    };
    return new Observable(observer => {
      this.apiService.post(url, bodyParams, httpOptions)
        .subscribe(result => {
          if (typeof(result.token) === 'string') {
            this.setToken(result.token);
          }
          if (result.user) {
            this.user = result.user;
          }
          observer.next(result);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  public findUser(username: string): Observable<string> {
    const url = AppSettings.API_URL + '/user/find';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.getToken() || ''
      })
    };
    const bodyParams = {
      username: username
    };
    return new Observable(observer => {
      this.apiService.post(url, bodyParams, httpOptions)
        .subscribe(result => {
            observer.next(result.id);
            observer.complete();
          },
          (error) => {
            observer.error(error);
            observer.complete();
          });
    });
  }

}
