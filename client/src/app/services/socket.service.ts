import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  API_URL: string = environment.URL;
  io = io(this.API_URL, {withCredentials: true})
  constructor() { }
}
