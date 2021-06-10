'use strict'

var express = require('express');
var messageController = require('../controllers/MessageController');
var auth = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');
var path = multipart({ uploadDir: './uploads/perfiles' });


var api = express.Router();

api.post('/messenger', messageController.send);
api.get('/messenger/:para/:de', messageController.data_messenger);

module.exports = api;