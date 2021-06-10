var Message = require('../models/message');

function send(req, res) {
    var params = req.body;

    var message = new Message();
    message.de = params.de;
    message.para = params.para;
    message.msm = params.msm;

    message.save((error, message) => {
        if (!error) {
            if (message) {
                res.status(200).send({
                    user: message,
                });
            } else {
                res.status(200).send({ error: error });
            }
        }
        else {
            res.status(200).send({ error: error });
        }
    });
}

function data_messenger(req, res) {
    var params = req.body;
    var de = req.params.de;
    var para = req.params.para;

    const data = {
        '$or': [
            {
                '$and': [
                    {
                        'para': de
                    }, {
                        'de': para
                    }
                ]
            }, {
                '$and': [
                    {
                        'para': para
                    }, {
                        'de': de
                    }
                ]
            },
        ]
    };

    Message.find(data).sort({ createAt: 1 }).exec(function (err, messages) {
        if (messages) {
            res.status(200).send({ messages: messages });
        }
        else {
            res.status(200).send({ message: "No hay ningun mensaje" });
        }
    });
}

module.exports = {
    send,
    data_messenger,
}










function update_stock(req, res) {
    var id = req.params['id'];
    var data = req.body;

    Producto.findById(id, (err, producto_data) => {
        if (producto_data) {
            Producto.findByIdAndUpdate(id, { stock: parseInt(producto_data.stock) + parseInt(data.stock) }, (err, producto_update) => {
                if (producto_update) {
                    res.status(200).send({ producto: producto_update });
                }
            })
        } else {
            res.status(200).send(err);
        }
    });
}
