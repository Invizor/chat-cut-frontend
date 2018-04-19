import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { AppSettings } from '../../app-config';
import { User } from '../models/user.model';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class ImageService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  uploadAvatar(form: FormData) {
    const url = AppSettings.API_URL + '/upload/avatar';
    const options = {
      headers: new HttpHeaders({
        authorization: this.authService.getToken()
      })
    };
    return this.apiService.post(url, form, options)
      .map(result => {
        const objSub = this.authService.updateUser()
          .subscribe((res) => {
            objSub.unsubscribe();
          },
          err => {
            objSub.unsubscribe();
          });
        return result;
      });
  }

  uploadFile(form: FormData) {
    const url = AppSettings.API_URL + '/upload/file';
    const options = {
      headers: new HttpHeaders({
        authorization: this.authService.getToken()
      })
    };
    return this.apiService.post(url, form, options)
      .map(result => {
        return result;
      });
  }
}
