'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'diegoarca';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        imagen: user.imagen,
        estado: user.estado,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    }

    return jwt.encode(payload,secret);
}