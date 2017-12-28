'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
User Schema
*/
var TechStackSchema = new Schema({
    techStackName : {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    techStackDesc: {
        type: String,
        trim: true,
        default: ''
    },
    techStackImg: {
        type: String,
        default: 'no-img-open-source.png'

    },
    stacks: {
        type: [],
        default: []
    },
   /* buId: {
        type: String,
        default: ''
    },
    ikareProject: {
        type: String,
        default: ''
    },
    subProjectId: {
        type: String,
        default: ''
    },*/
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
module.exports = mongoose.model('TechStack', TechStackSchema);