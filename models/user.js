'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

/*
User Schema
*/
var UserSchema = new Schema({
    email : {
        type: String,
        unique: true,
        lowercase : true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
   /* roles: {
        type: [],
        default: []
    },
    ikareProject: {
        type: String,
        default: ''
    },
    subProjectId: {
        type: String,
        default: ''
    },*/
    verifiedToken: {
        type: Boolean,
        default: false
    },
    verifiedUser: {
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

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);