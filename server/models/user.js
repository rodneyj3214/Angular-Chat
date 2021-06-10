'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    imagen: String,
    pais: String,
    telefono: String,
    twitter: String,
    facebook: String,
    github: String,
    bio: String,
    notificacion: Boolean,
    estado: Boolean,
    sonido: Boolean,
});

module.exports = mongoose.model('user',UserSchema);