import { } from './models.index';

export interface User {
    _id?: String;
    nombre?: String;
    email?: String;
    password?: String;
    imagen?: String;
    pais?: String;
    telefono?: String;
    twitter?: String;
    facebook?: String;
    github?: String;
    bio?: String;
    notificacion?: Boolean;
    estado?: Boolean;
    sonido?: Boolean;
}
