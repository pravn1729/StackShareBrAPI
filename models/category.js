'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
Stack Category Schema
*/
var CategorySchema = new Schema({
    categoryName : {
        type: String,
        trim: true,
        required: true,
        default: ''
    },
    subCategoryName: {
        type: String,
        trim: true,
        default: ''
    },
    layerName:{
        type: String,
        trim: true,
        default: ''
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
module.exports = mongoose.model('Category', CategorySchema);