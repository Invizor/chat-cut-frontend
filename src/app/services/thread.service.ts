import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Thread} from '../models/thread.model';
import {AppSettings} from '../../app-config';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class ThreadService {
  private _threadsList: ReplaySubject<Thread[]> = new ReplaySubject(1);
  isLoadThreads = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.init();
  }

  private init() {
    this.checkThreads();
  }

  private setThreads(threads) {
    this.isLoadThreads = Boolean(threads);
    this._threadsList.next(threads);
  }

  private checkThreads() {
    let subThreads = null;
    setInterval( () => {
      this.isLoadThreads = false;
      if (subThreads) {
        subThreads.unsubscribe();
      }
      subThreads = this.getThreads().subscribe(() => {});
    } , 10000);
  }

  public getThread(idThread) {
    const url = AppSettings.API_URL + '/thread/';
    const params = {
      'id': idThread
    };
    return this.apiService.get(url, params)
      .map((data) => {
        return data;
      });
  }

  public createThread(listIdUsers: string[]) {
    const url = AppSettings.API_URL + '/thread/create';
    const body = {
      listIdUsers: listIdUsers
    };
    return this.apiService.post(url, body)
      .flatMap(result => {
        this.isLoadThreads = false;
        return this.getThreads();
      });
  }

  public removeThread(idThread: string) {
    const url = AppSettings.API_URL + '/thread/remove';
    const body = {
      id: idThread
    };

    return this.apiService.post(url, body)
      .flatMap((result) => {
        this.isLoadThreads = false;
        return this.getThreads();
      });
  }

  public removeUserFromThread(idThread: string) {
    const url = AppSettings.API_URL + '/thread/remove-user';
    const body = {
      id: idThread
    };

    return this.apiService.post(url, body)
      .flatMap((result) => {
        this.isLoadThreads = false;
        return this.getThreads();
      });
  }

  public getThreads(): Observable<Thread[]> {
    if (this.isLoadThreads) {
      return this._threadsList.asObservable();
    } else {
      const url = AppSettings.API_URL + '/thread/get';

      return this.apiService.get(url)
        .flatMap((data) => {
          if (data && Array.isArray(data.listThreads)) {
            this.setThreads(data.listThreads);
          }
          return this._threadsList.asObservable();
        });
    }
  }

}
