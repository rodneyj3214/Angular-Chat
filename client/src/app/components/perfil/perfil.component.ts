import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { UserService } from 'src/app/services/user.service';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public socket = io('http://localhost:4201');
  public identity;
  public url;
  public de;
  public datos_config: any = {};
  public datos_user: any = {};
  public data: any = {};
  public data_send: any = {};
  public password;
  public confirm_pass;
  public msm_confirm_pass;
  public msm_success;
  public usuarios;

  public file: File;
  public imgselected: String | ArrayBuffer;

  formPerfilIn = this.formBuilder.group({
    nombre: '',
    email: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.identity = this._userService.getIdentity();
    this.url = "http://localhost:3000/api/";
    this.de = this.identity._id;
  }

  ngOnInit(): void {

    if (!this.identity) {
      this._router.navigate(['']);
    } else {
      this._userService.get_user(this.de).subscribe(
        response => {
          this.datos_config = response.config;
          this.datos_user = response.user;
          this.data = {
            nombre: this.datos_user.nombre,
            email: this.datos_user.email,
            telefono: this.datos_user.telefono,
            bio: this.datos_user.bio,
            twitter: this.datos_user.twitter,
            facebook: this.datos_user.facebook,
            github: this.datos_user.github,
            estado: this.datos_user.estado,
          }
        },
        error => {
        }
      )
    }
  }

  /**
   * 
   * @param event : 
   */
  imgSelected(event: HtmlInputEvent) {
    console.log("Entre");
    if (event.target.files) {
      if (event.target.files[0]) {
        this.file = <File>event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => this.imgselected = reader.result;
        reader.readAsDataURL(this.file);
      }
    }
  }

  perfilForm() {
    if (this.formPerfilIn.valid) {

      if (this.formPerfilIn.value.password != undefined) {


        if (this.formPerfilIn.value.password != this.formPerfilIn.value.confirm_pass) {
          this.msm_confirm_pass = "Las contraseñas no coinciden";
        } else {

          this.msm_confirm_pass = "";
          this.data_send = {
            _id: this.datos_user._id,
            nombre: this.formPerfilIn.value.nombre,
            telefono: this.formPerfilIn.value.telefono,
            imagen: this.file,
            password: this.formPerfilIn.value.password,
            bio: this.formPerfilIn.value.bio,
            twitter: this.formPerfilIn.value.twitter,
            facebook: this.formPerfilIn.value.facebook,
            github: this.formPerfilIn.value.github,

            estado: this.formPerfilIn.value.estado,

          }

          this.socket.emit('save-identity', { identity: this.data_send });

          this._userService.update_config(this.data_send).subscribe(
            response => {
              this.msm_success = 'Se actualizó su perfil con exito';
              this._userService.listar('').subscribe(
                response => {
                  this.usuarios = response.users;
                  this.socket.emit('save-users', { users: this.usuarios });


                },
                errorr => {

                }
              );
            },
            error => {

            }
          );
        }
      } else {

        this.msm_confirm_pass = "";
        this.data_send = {
          _id: this.datos_user._id,
          nombre: this.formPerfilIn.value.nombre,
          telefono: this.formPerfilIn.value.telefono,
          imagen: this.file,
          bio: this.formPerfilIn.value.bio,
          twitter: this.formPerfilIn.value.twitter,
          facebook: this.formPerfilIn.value.facebook,
          github: this.formPerfilIn.value.github,

          estado: this.formPerfilIn.value.estado,

        }
        this._userService.update_config(this.data_send).subscribe(
          response => {
            this.msm_success = 'Se actualizó su perfil con exito';
            this._userService.listar('').subscribe(
              response => {
                this.usuarios = response.users;
                this.socket.emit('save-users', { users: this.usuarios });


              },
              errorr => {

              }
            );
          },
          error => {

          }
        );

      }
      this.msm_success = '';

    }

  }

}
