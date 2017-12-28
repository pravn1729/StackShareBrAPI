'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
Stack Schema
*/
var StackSchema = new Schema({
    stackName : {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    stackDesc: {
        type: String,
        default: ''
    },
    stackImg: {
        type: String,
        default: 'no-img-open-source.png'
    },
    layerName:{
        type: String,
        default: ''
    },
    approved:{
        type: Boolean,
        default: false
    },
    createId: {
        type: String,
        default: 'admin'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    maintId: {
        type: String,
        default: ''
    },
    maintDate: {
        type: Date,
        default: ''
    }
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Stack', StackSchema);