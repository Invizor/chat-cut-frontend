import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  public get(url: string, options: object): Observable<any> {

    return new Observable(observer => {
      this.httpClient.get(url, options)
        .subscribe(result => {
            if (!result || !result['success']) {
              observer.error(result);
              observer.complete();
            } else {
              observer.next(result);
              observer.complete();
            }
          },
          (error) => {
            observer.error(error);
            observer.complete();
          });
    });
  }

  public post(url: string, body: object, options?: object): Observable<any> {

    return new Observable(observer => {
      this.httpClient.post(url, body, options)
        .subscribe(result => {
            if (!result || !result['success']) {
              observer.error(result);
              observer.complete();
            } else {
              observer.next(result);
              observer.complete();
            }
          },
          (error) => {
            observer.error(error);
            observer.complete();
          });
    });
  }

}
