import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Message} from '../models/message.model';
import {AppSettings} from '../../app-config';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Thread} from '../models/thread.model';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class MessageService {
  listThreads = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.init();
  }

  private init() {
  }

  public createMessage(idThread: string, text: string) {
    const url = AppSettings.API_URL + '/message/create';
    const bodyParams = {
      idThread: idThread,
      text: text
    };
    return this.apiService.post(url, bodyParams)
        .flatMap((data) => {
          return this.getMessages(idThread);
        });
  }

  public removeMessage(idMessage: string) {
    const url = AppSettings.API_URL + '/message/remove';
    const bodyParams = {
      id: idMessage
    };
    return this.apiService.post(url, bodyParams)
      .flatMap((data) => {
        return this.getMessages(data.message.idThread);
      });
  }

  public getMessages(idThread: string): Observable<Message[]> {
    const url = AppSettings.API_URL + '/message/';
    const params = {
      'idThread': idThread
    };
    return this.apiService.get(url, params)
      .map((data) => {
        if (Array.isArray(data.messages)) {
          if (!this.listThreads[idThread]) {
            this.listThreads[idThread] = new ReplaySubject(1);
          }
          this.listThreads[idThread].next(data.messages);
        }
        return data.messages;
      });
  }

  public clearMessageAtThread(idThread: string) {
    const url = AppSettings.API_URL + '/message/clear';
    const bodyParams = {
      'idThread': idThread
    };
    return this.apiService.post(url, bodyParams)
      .map((data) => {
        if (!this.listThreads[idThread]) {
          this.listThreads[idThread].next([]);
        }
        return data;
      });
  }

}
