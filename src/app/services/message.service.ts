import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Message} from '../models/message.model';
import {AppSettings} from '../../app-config';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';

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

  public addMessageLocal(idThread: string, message: Message) {
    if (typeof(idThread) === 'string' && message) {
      if (Array.isArray(this.listThreads[idThread])) {
        this.listThreads[idThread].push(message);
      } else {
        this.listThreads[idThread] = [message];
      }
    }
  }

  public removeMessageLocal(idThread: string, idMessage: string) {
    if (typeof(idThread) === 'string' && typeof(idMessage) === 'string') {
      if (Array.isArray(this.listThreads[idThread])) {
        this.listThreads = this.listThreads[idThread].filter(itemMessage => {
          return itemMessage._id !== idMessage;
        });
      }
    }
  }

  public createMessage(idThread: string, text: string) {
    const url = AppSettings.API_URL + '/message/create';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {}
    };
    const bodyParams = {
      idThread: idThread,
      text: text
    };
    return new Observable(observer => {
      this.apiService.post(url, bodyParams, httpOptions)
        .subscribe((data) => {
            if (data && data.message) {
              this.addMessageLocal(idThread, data.message);
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

  public removeMessage(idMessage: string) {
    const url = AppSettings.API_URL + '/message/remove';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {}
    };
    const bodyParams = {
      id: idMessage
    };
    return new Observable(observer => {
      this.apiService.post(url, bodyParams, httpOptions)
        .subscribe((data) => {
            if (data && data.message) {
              this.removeMessageLocal(data.message.idThread, idMessage);
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

  public getMessages(idThread: string) {
    const url = AppSettings.API_URL + '/message/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {
        'idThread': idThread
      }
    };
    return new Observable(observer => {
      this.apiService.get(url, httpOptions)
        .subscribe((data) => {
            if (Array.isArray(data.messages)) {
              this.listThreads[idThread] = data.messages;
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

  public clearMessageAtThread(idThread: string) {
    const url = AppSettings.API_URL + '/message/clear';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.authService.token || ''
      }),
      params: {}
    };
    const bodyParams = {
      'idThread': idThread
    };
    return new Observable(observer => {
      this.apiService.post(url, bodyParams, httpOptions)
        .subscribe((data) => {
            this.listThreads[idThread] = [];
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
