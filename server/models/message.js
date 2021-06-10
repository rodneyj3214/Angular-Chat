
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    de: { type: Schema.ObjectId, ref: 'user' },
    para: { type: Schema.ObjectId, ref: 'user' },
    msm: { type: String },
    visto: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('message', MessageSchema);