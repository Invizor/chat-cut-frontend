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
  isLoaded = false;

  constructor(
    private apiService: ApiService
  ) {
    this.init();
  }

  private init() {
    this.getUser()
      .subscribe(user => {
      });
  }

  public checkAuthorization() {
    const token = localStorage.getItem('token');
    return (this.checkToken() && this.isLoaded);
  }

  public checkToken() {
    const token = this.getToken();
    return Boolean(typeof(token) === 'string' && token.length > 0);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.apiService.setToken(token);
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

  public setUser(user) {
    this.isLoaded = Boolean(user);
    this._user.next(user);
  }

  public getUser(): Observable<any> {
    const url = AppSettings.API_URL + '/user/';
    const token = window.localStorage.getItem('token');
    this.apiService.setToken(token);
    if (this.checkAuthorization()) {
      return this._user.asObservable();
    } else {
      if (this.getToken()) {
        return this.apiService
          .get(url)
          .map((data) => {
            if (data.user) {
              this.setUser(data.user);
            } else {
              this.setUser(null);
            }
            return data;
          });
      } else {
        this.setUser(null);
        return this._user.asObservable();
      }
    }
  }

  public getUserLocalData(): Observable<User> {
    return this._user.asObservable();
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
          this.setUser(result.user);
        } else {
          this.setUser(null);
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

  public getUsersName(listIdUsers: string[]): Observable<any> {
    const url = AppSettings.API_URL + '/user/get-users-name';
    const bodyParams = {
      listIdUsers: listIdUsers
    };
    return this.apiService.post(url, bodyParams)
      .map(result => {
        return result;
      });
  }

}
