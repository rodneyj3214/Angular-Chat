import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  API_URL: string = environment.URL;
  public url;
  public user: User;
  public token;
  public identity;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = this.API_URL + "api/";
  }

  send_message(message): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'messenger', message, { headers: headers });
  }
/*
  visto(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url + 'visto/' + id, { headers: headers });
  }

  last_messages(para, de): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'last-msm/' + para + '/' + de, { headers: headers });
  }

*/
}
