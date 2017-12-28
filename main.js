'use strict';

// NPM dependencies
var express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    systemProperties = require('./config/system-properties');



/*
//https://github.com/sahat/Nodemailer
var nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'pravn1729@gmail.com',
        pass: config.password
    },
    tls: {
        rejectUnauthorized: flase
    }
});

let HelperOptions ={
    fromm: '"Praveen Challa" <paddy@gmail.com>',
    to: 'pravn1729@gmail.com',
    subject: 'Hello, World',
    text: 'Wow this tutorial is amazing',
    //html: ''
}

transporter.sendMail(HelperOptions, (error, info)=> {
    if(error){
        console.log(error);
    }else{
        console.log('The message was sent'+ info);
    }
});
*/

/*
Configuration
*/
//Build Model
var env = process.env.bm || 'dev';
mongoose.connect(systemProperties[env].database, { useMongoClient: true });
/*
Initializations
 */
var app = express();

/*
Middlewares
*/
// Parse as urlencoded and json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Hook up the HTTP logger
app.use(morgan('dev'));
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*api.post('/create',requireAdmin, function (req, res) {
    //.....
 }
 
 function requireAdmin(request, response, next) {
     if (request.decoded.role != 'admin') {
         response.json({message: 'Permission denied.' });
     }
     else {
         next();
     }
 };
 */

var apiRoutes = express.Router();

/*

{
  "sub": "1234567890",
  "name": "John Doe",
  "roles": [
    "ADMIN",
    "SUPERUSER"
  ]
}
*/

/* Set the static files location.
app.use(express.static(__dirname + '../../public'));
*/

// Protect Routes with JWT
require('./routes/authRtr')(apiRoutes);
//require('./routes/userRtr')(apiRoutes, passport);
require('./routes/techStackRtr')(apiRoutes, checkAuthenticated);


function checkAuthenticated(req, res, next){
    if(!req.header('authorization')){
        return res.status(401).send({message: 'unauthorized requested.'});
    // var header = new Header({'Authorization': 'Bearer'+localStorage.getItem(this.TOKEN_KEY)})
    
        var token = req.header('authorization').split(' ')[1];
        var payload = jwt.decode(token, '123');
        if(!payload){
            return res.status(401).send({message: 'unauthorized request. Authentication header is invalid'});
            
        req.user = payload;
        next();
        }
    }
}

app.use('/api/'+ systemProperties[env].version, apiRoutes);

// Start Server
app.listen(systemProperties[env].port);
console.log('StackShareAPI is running');

// bm=dev node main.js