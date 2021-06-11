import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

import { Message } from 'src/app/models/message';
import Push from "push.js"
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;


  public identity: any = {};
  public de;
  public url;
  public data_message;
  public socket = io('http://localhost:3000');
  public usuarios: Array<any> = [];
  public mensajes;
  public message;
  public usuario_select: any = null;
  public token;
  public pre_selected;
  public last_msm;
  text = "";

  constructor(private _userService: UserService,
    private _messageService: MessageService,
    private _router: Router
  ) {
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
    this.url = "http://localhost:3000/api/";
    this.de = this.identity._id;
    this.socket.on('new-message', function (data) {
      var data_all = {
        de: data.message.de,
        para: data.message.para,
        msm: data.message.msm,
        // createAt: data.message.createAt,
      }
      this._userService.get_user(data.message.de).subscribe(
        response => {
          this.socket.on('get-identity', function (data) {
            console.log(data);
            this.identity = data;
          }.bind(this));
          if (data.message.de != this.de) {
            console.log(data.message.msm);
            Push.create(response.user.nombre, {
              body: data.message.user.msm,
              icon: this.url + 'usuarios/img/' + response.user.imagen,
              timeout: 4000,
              onClick: function () {
                window.focus();
                this.close();
              }
            });
            (document.getElementById('player') as any).load();
            (document.getElementById('player') as any).play();
          }
        },
        error => {
        }
      )
      this.mensajes.push(data_all);
    }.bind(this));
  }
  ngOnInit(): void {
    if (!this.identity) {
      this._router.navigate(['']);
    } else {
      this._userService.listar('').subscribe(
        response => {
          this.usuarios = response.users;
        },
        error => {
        }
      );
      
      this.socket.on('get-user', function (data) {
        this.usuarios.push(data.user);
      }.bind(this));
      this.socket.on('get-users', function (data) {
        this.usuarios = data.users.users;
      }.bind(this));
    }
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  listar(para) {

    this._userService.get_messages(para, this.de).subscribe(
      response => {
        this.mensajes = response.messages;
        this.scrollToBottom();
      },
      error => {
      }
    );
    this._userService.get_user(para).subscribe(
      response => {
        this.usuario_select = response.user;


      },
      error => {

      }
    );
  }
  onSubmit() {
    this.message = {
      de: this.de,
      para: this.usuario_select._id,
      msm: this.text,
    };
    this._messageService.send_message(this.message).subscribe(
      response => {
        //SEND MESSAGE
        this.socket.emit('save-message', this.message);

        this.scrollToBottom();
        this.text = "";
      },
      error => {
      }
    )
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  ngDoCheck() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();

  }
  logout() {
    this._userService.desactivar_user(this.identity._id).subscribe(
      response => {
        this._userService.listar('').subscribe(
          response => {
            this.usuarios = response.users;
            this.socket.emit('save-users', { users: this.usuarios });


          },
          error => {

          }
        );
      },
      error => {

      }
    );
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.token = null;
    this.identity = null;



    this._router.navigate(['']);
  }

}
