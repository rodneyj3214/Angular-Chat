import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { io } from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  API_URL: string = environment.URL;

  public user;
  
  formRegistroIn = this.formBuilder.group({
    nombre: '',
    email: '',
    password: ''
  });

  public socket = io(this.API_URL);

  constructor(private formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
  }

  registroForm() {
    this._userService.registrar({
      nombre: this.formRegistroIn.value.nombre,
      email: this.formRegistroIn.value.email,
      password: this.formRegistroIn.value.password,
    }).subscribe(
      response => {
        this._router.navigate(['']);
      },
      error => {

      }
    );
    console.log("Rodney");
    console.warn('Your order has been submitted', this.formRegistroIn.value);

  }


}
