import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL: string = environment.URL + 'api/';

  public url;
  public user: User;
  public token;
  public identity;

  constructor(private _http: HttpClient,) {
    this.url = this.API_URL;
  }

  registrar(user): Observable<any> {
    var obj = {
      nombre: user.nombre,
      email: user.email,
      password: user.password,
    }
    console.log(obj)
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro', obj, { headers: headers });
  }

  login(user, gettoken = null): Observable<any> {
    let json = user;
    console.log(gettoken);
    if (gettoken != null) {
      console.log(user);
      console.log("Que paso");

      user.gettoken = true;
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login', json, { headers: headers });
  }
  activar_user(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'usuario/activar/' + id, { headers: headers });
  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  get_user(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'usuario/' + id, { headers: headers });
  }
  get_messages(para, de): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'messenger/' + para + '/' + de, { headers: headers });
  }

  listar(buscar): Observable<any> {
    let search;
    if (buscar == undefined) {
      search = "";
    }
    else {
      search = buscar;
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'usuarios/' + search, { headers: headers });
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity) {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  desactivar_user(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'usuario/desactivar/' + id, { headers: headers });
  }

  update_config(data): Observable<any> {
    console.log(data);

    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('telefono', data.telefono);
    fd.append('imagen', data.imagen);
    if (data.password) {
      fd.append('password', data.password);
    }
    fd.append('bio', data.bio);
    fd.append('twitter', data.twitter);
    fd.append('facebook', data.facebook);
    fd.append('github', data.github);
    fd.append('notificacion', data.notificacion);
    fd.append('estado', data.estado);
    fd.append('sonido', data.sonido);

    return this._http.put(this.url + 'usuario/editar/' + data._id, fd);
  }
}
