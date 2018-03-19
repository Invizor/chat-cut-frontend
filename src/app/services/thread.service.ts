import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Thread} from '../models/thread.model';
import {AppSettings} from '../../app-config';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ThreadService {

  listThreads: Thread[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.init();
  }

  private init() {
  }

  public getThread(idThread) {
    const url = AppSettings.API_URL + '/thread/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {
        'id': idThread
      }
    };
    return new Observable(observer => {
      this.apiService.get(url, httpOptions)
        .subscribe((data) => {
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  public createThread(listIdUsers: string[]) {
    const url = AppSettings.API_URL + '/thread/create';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {}
    };
    const body = {
      listIdUsers: listIdUsers
    };
    return new Observable(observer => {
      this.apiService.post(url, body, httpOptions)
        .subscribe(
        result => {
          if (result.thread) {
            this.listThreads.push(result.thread);
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

  public removeThread(idThread: string) {
    const url = AppSettings.API_URL + '/thread/remove';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {}
    };
    const body = {
      id: idThread
    };

    return new Observable(observer => {
      this.apiService.post(url, body, httpOptions)
        .subscribe((result) => {
          if (result) {
            this.listThreads = this.listThreads.filter(item => item._id !== idThread);
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

  public getThreads(idUser: string) {
    const url = AppSettings.API_URL + '/thread/get';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {
        'iduser': idUser
      }
    };

    return new Observable(observer => {
      this.apiService.get(url, httpOptions)
        .subscribe((data) => {
          if (data) {
            this.listThreads = data.listThreads;
          }
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

}
