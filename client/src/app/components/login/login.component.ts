import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { User } from '../../models/models.index';
import { UserService } from "../../services/user.service";
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  API_URL: string = environment.URL;

  public user: User;
  public status;
  public token;
  public identity;
  public usuarios;

  formLoginIn = this.formBuilder.group({
    email: '',
    password: '',
    gettoken: false,
  });

  constructor(private formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private socket: SocketService,
  ) {
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    if (this.identity) {
      this._router.navigate(['messenger']);
    }
  }

  loginForm() {
    if (this.formLoginIn.valid) {
      this._userService.login(this.formLoginIn.value).subscribe(
        response => {
          console.log(response);
          this.token = response.jwt;
          localStorage.setItem('token', this.token);
          this._userService.login(this.formLoginIn.value, true).subscribe(
            response => {
              console.log(response);
              localStorage.setItem('identity', JSON.stringify(response.user));
              this._userService.activar_user(response.user._id).subscribe(
                response => {
                  this._userService.listar('').subscribe(
                    response => {
                      this.usuarios = response.users;
                      this.socket.io.emit('save-users', { users: this.usuarios });
                    },
                    error => {
                    }
                  );
                },
                error => {
                }
              );
              this._router.navigate(['messenger']);
            },
            error => {
              console.log(<any>error);
            }
          );
        },
        error => {
          console.log(<any>error);
        }
      );
    }
  }
}
