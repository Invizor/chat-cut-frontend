import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { AppSettings } from '../../app-config';
import { User } from '../models/user.model';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class AuthService {
  private _user: ReplaySubject<User> = new ReplaySubject(1);

  constructor(
    private apiService: ApiService
  ) {
    this.init();
  }

  private init() {
    if (this.checkToken()) {
      this.getUser()
        .subscribe(user => {});
    }
  }

  public checkAuthorization() {
    return Boolean(this.checkToken());
  }

  public checkToken() {
    const token = this.getToken();
    return Boolean(typeof(token) === 'string' && token.length > 0);
  }

  public getToken() {
    let tokenResult = null;
    const tokenLS = window.localStorage.getItem('token');
    if (typeof(tokenLS) === 'string' && tokenLS.length > 0) {
      tokenResult = tokenLS;
    }
    return tokenResult;
  }

  public setToken(token) {
    if (typeof(token) === 'string' && token.length > 0) {
      window.localStorage.setItem('token', token);
      this.apiService.setToken(token);
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
    const token = window.localStorage.getItem('token');
    if (this.checkAuthorization()) {
      this.apiService.setToken(token);
      return this.apiService
        .get(url)
        .map((data) => {
          if (data.user) {
            this._user.next(data.user);
          } else {
            this._user.next(null);
          }
          return data;
        });
    } else {
      this._user.next(null);
      return this._user.asObservable();
    }
  }

  public registerUser(user: User) {
    const url = AppSettings.API_URL + '/user/register';
    return this.apiService.post(url, user)
      .flatMap(userData => {
        return this.loginUser(userData.user.email, userData.user.password);
      });
  }

  public loginUser(email: string, password: string) {
    const url = AppSettings.API_URL + '/user/login';
    const bodyParams = {
      email: email,
      password: password
    };
    return this.apiService.post(url, bodyParams)
      .map(result => {
        if (result.user && result.token) {
          this.setToken(result.token);
          this.apiService.setToken(result.token);
          this._user.next(result.user);
        } else {
          this._user.next(null);
        }
        return result;
      });
  }

  public findUser(username: string): Observable<string> {
    const url = AppSettings.API_URL + '/user/find';
    const bodyParams = {
      username: username
    };
    return this.apiService.post(url, bodyParams)
      .map(result => {
        return result;
      });
  }

}
