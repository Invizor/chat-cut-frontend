import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { AppSettings } from '../../app-config';
import {ServerResponseModel} from '../models/server-response.model';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private _http: HttpClient) {}

  public get(path: string, params?: object, options = null): Observable<any> {

    let resultPath = path;
    let resultOptions = {
      headers: this.httpOptions.headers
    };
    if (options) {
      resultOptions = options;
    }

    if (params) {
      resultPath += '?';
      Object.keys(params).forEach(key => {
        resultPath += `${key}=${params[key]}&`;
      });
      resultPath = resultPath.slice(0, -1);
    }

    return this._http
      .get(resultPath, resultOptions)
      .map((data: ServerResponseModel) => {
        let resultData = {};
        Object.keys(data).forEach(key => {
          if (key !== 'success') {
            resultData[key] = data[key];
          }
        });
        if (!data.success) {
          return resultData;
        }

        return resultData;
      });
  }

  public post(path: string, params?: object, options = null): Observable<any> {
    const resultPath = path;
    let resultOptions = {
      headers: this.httpOptions.headers
    };
    if (options) {
      resultOptions = options;
    }
    const resultBody = params;

    return this._http
      .post(resultPath, resultBody, resultOptions)
      .map((data: ServerResponseModel) => {
        let resultData = {};
        Object.keys(data).forEach(key => {
          if (key !== 'success') {
            resultData[key] = data[key];
          }
        });
        if (!data.success) {
          throw resultData;
        }

        return resultData;
      });
  }

  setToken(authorization) {
    if (authorization) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          authorization
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
    }
  }

}
