var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var path = require('path');

function registro(req, res) {

    var params = req.body;
    var user = new User();
    user.nombre = params.nombre;
    user.email = params.email;
    user.password = params.password;
    user.imagen = "null";
    user.telefono = '';
    user.bio = '';
    user.facebook = 'undefined';
    user.twitter = 'undefined';
    user.github = 'undefined';
    user.estado = true;


    if (params.password) {
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            User.findOne({ email: params.email }, (err, user_email) => {
                if (user_email) {
                    res.status(403).send({ message: "El correo ya esta en uso" });
                } else {
                    user.save((error, user_data) => {
                        if (!error) {
                            if (user_data) {
                                res.status(200).send({ user: user_data });
                            } else {
                                res.status(403).send({ error: error });
                            }
                        }
                        else {
                            res.status(403).send({ error: error });
                        }
                    });
                }
            });
        });
    } else {
        res.status(500).send({ message: "Ingrese la contraseña" });
    }
}

function login(req, res) {
    var params = req.body;
    User.findOne({ email: params.email }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor" });
        } else {
            if (!user) {
                console.log(params.email);
                res.status(404).send({ message: "Usuario no existe" });
            } else {
                console.log(params);
                bcrypt.compare(params.password, user.password, function (err, check) {
                    if (check) {
                        if (params.gettoken) {
                            res.status(200).send({
                                jwt: jwt.createToken(user),
                                user: user
                            });
                        } else {
                            res.status(200).send({ message: "No token", jwt: jwt.createToken(user), });
                        }
                    }
                    else {
                        res.status(500).send({ message: "Contraseña Incorrecta" });
                    }
                });
            }
        }
    });
}

function get_user(req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        if (!err) {
            if (user) {
                res.status(200).send({ user: user });
            } else {
                res.status(500).send({ message: "Usuario no encontrado" });
            }
        }
        else {
            res.status(500).send({ message: "Error en el servidor" });
        }
    })
}

function users(req, res) {
    var params = req.body;
    var name = req.params.nombre;

    User.find({ nombre: new RegExp(name, 'i') }).sort({ nombre: 1 }).exec(function (err, users) {
        if (users) {
            res.status(200).send({ users: users });
        }
        else {
            res.status(200).send({ users: "No hay ningun mensaje" });
        }
    });
}

function activar_estado(req, res) {
    var id = req.params['id'];

    User.findByIdAndUpdate({ _id: id }, { estado: true }, (err, estado_update) => {
        if (!err) {
            if (estado_update) {
                res.status(200).send({ user: estado_update });
            } else {
                res.status(500).send({ message: "Usuario no encontrado" });
            }
        } else {
            res.status(500).send({ message: "Error en el servidor" });
        }
    })
}

function desactivar_estado(req, res) {
    var id = req.params['id'];

    User.findByIdAndUpdate({ _id: id }, { estado: false }, (err, estado_update) => {
        if (!err) {
            if (estado_update) {
                res.status(200).send({ user: estado_update });
            } else {
                res.status(500).send({ message: "Usuario no encontrado" });
            }
        } else {
            res.status(500).send({ message: "Error en el servidor" });
        }
    })
}

function update_foto(req, res) {
    var id = req.params.id;
    if (req.files) {
        var imagen_path = req.files.imagen.path;
        var name = imagen_path.split('/');
        var img_name = name[2];

        var img_name_exp = img_name.split('\.');
        var img_extencion = img_name_exp[1];

        if (img_extencion == "png" || img_extencion == "jpg" || img_extencion == "gif") {
            User.findByIdAndUpdate(id, { imagen: img_name }, function (err, user) {
                if (user) {
                    res.status(200).send({ user: user });
                }
                else {
                    res.status(403).send({ message: "No se pudo actualizar" });
                }
            });
        } else {
            res.status(200).send({ message: "Formato de archivo no valido" });
        }
    }
    else {
        res.status(500).send({ message: "No subiste ninguna imagen" });
    }
}

function get_imagen(req, res) {

    var imagen = req.params.img;

    if (imagen != "null") {
        var path_img = "./uploads/perfiles/" + imagen;
        res.status(200).sendFile(path.resolve(path_img));
    }
    else {
        var path_img = "./uploads/perfiles/default.jpg";
        res.status(200).sendFile(path.resolve(path_img));
    }
}

function editar_config(req, res) {
    var id = req.params['id'];
    var params = req.body;

    if (req.files.imagen) {
        if (params.password) {
            console.log('1');

            bcrypt.hash(params.password, null, null, (err, hash) => {
                let imagen_path = req.files.imagen.path;
                let name = imagen_path.split('\\');
                let img_name = name[2];

                User.findByIdAndUpdate({ _id: id }, { nombre: params.nombre, password: hash, imagen: img_name, pais: params.pais, telefono: params.telefono, twitter: params.twitter, facebook: params.facebook, github: params.github, bio: params.bio, estado: params.estado }, (err, user_edit,) => {
                    if (err) {
                        res.status(500).send({ message: "Error en el servidor" });
                    } else {
                        if (user_edit) {
                            res.status(200).send({ user: user_edit });
                        }
                    }
                });
            });
        } else {

            console.log('2');

            let imagen_path = req.files.imagen.path;
            let name = imagen_path.split('/');
            let img_name = name[2];

            User.findByIdAndUpdate({ _id: id }, { nombre: params.nombre, imagen: img_name, telefono: params.telefono, twitter: params.twitter, facebook: params.facebook, github: params.github, bio: params.bio, estado: params.estado }, (err, user_edit) => {
                if (err) {
                    res.status(500).send({ message: "Error en el servidor" });
                } else {
                    if (user_edit) {
                        res.status(200).send({ user: user_edit });
                    }
                }
            });
        }
    } else {
        if (params.password) {
            bcrypt.hash(params.password, null, null, (err, hash) => {
                console.log('3');
                User.findByIdAndUpdate({ _id: id }, { nombre: params.nombre, password: hash, pais: params.pais, telefono: params.telefono, twitter: params.twitter, facebook: params.facebook, github: params.github, bio: params.bio, estado: params.estado }, (err, user_edit) => {
                    if (err) {
                        res.status(500).send({ message: "Error en el servidor" + err });
                    } else {
                        if (user_edit) {
                            res.status(200).send({ user: user_edit });
                        }
                    }
                });
            });
        } else {
            console.log('4');
            User.findByIdAndUpdate({ _id: id }, { nombre: params.nombre, pais: params.pais, telefono: params.telefono, twitter: params.twitter, facebook: params.facebook, github: params.github, bio: params.bio, estado: params.estado }, (err, user_edit) => {
                if (err) {
                    res.status(500).send({ message: "Error en el servidor" });
                } else {
                    if (user_edit) {
                        res.status(200).send({ user: user_edit });
                    }
                }
            });
        }
    }

}

module.exports = {
    registro,
    login,
    get_user,
    users,
    activar_estado,
    desactivar_estado,
    update_foto,
    get_imagen,
    editar_config
}