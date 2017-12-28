var bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    systemProperties = require('../config/system-properties'),
    HttpResponse = require('../utils/httpResponse'),
    RoleManager = require('../utils/roleManager');
    env = process.env.bm || 'dev';

exports.register = function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var position = req.body.position; // make this required and validate
  // validate ikareproject and subproject before inserting
  var ikareProjectId = req.body.ikareProjectId;
  var subProjectId   = req.body.subProjectId;

  var roles = RoleManager.getRoles(position);
  // Assign roles based on position

  // validations for inputs

  // create a new user
  var newUser = new User({ 
    email: email, 
    password: bcrypt.hashSync(password),
    roles: roles,
    ikareProjectId: ikareProjectId,
    subProjectId: subProjectId
  });

  // save the new user
  newUser.save(function(err, user) {
    if (err){
      res.json(HttpResponse.httpResponse(false, 400, 'Registered Already !'));
    }else{
      user.password = undefined;
      var token = jwt.sign({
        id: user._id,
        name: user.email,
        roles: user.roles
      },
        systemProperties[env].registrationTokenSecret,
        {expiresIn: systemProperties[env].registrationTokenExpiry}
      );

      // send mail

      res.json(HttpResponse.httpResponse(true, 200, 'Registered Successfully!',
                 {token: token, email: user.email}));
    }
  });
  
  //var token = jwt.sign(1, systemProperties[env].secret);
   /* var token = jwt.sign({id: 1, name: 'praveen', roles: ['admin','manager']}, systemProperties[env].secret, {expiresIn: '10m'});
    res.json({token: token, name: 'praveen'});
    */
};

/*
jwt.sign({
    data: 'foobar'
  }, 'secret', { expiresIn: 60 * 60 });
  
  //or even better:
  
  jwt.sign({
    data: 'foobar'
  }, 'secret', { expiresIn: '1h' });
*/

exports.verify = function(req,res){
    //var token = req.params['token'];
    var token = req.query.token;
    //console.log('token'+token);
    // Method1
    /*var payload = jwt.decode(token, systemProperties[env].secret, {expiresIn: 10});
    if(!payload){
        res.json({'function':'not authenticated'});
    }else{
        res.json({'function':'authenticated'});
    }*/

    // Method 2
     /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
          
    jwt.verify(token, systemProperties[env].registrationTokenSecret, function(err, decoded) {
        console.log('Decoded'+JSON.stringify(decoded));
        if (err) {
            res.json(HttpResponse.httpResponse(false, 400, 'Token is expired or not valid. Please request for new token!'));
        }else{
            // Enable the flag
            User.find({email: decoded.email, verifiedToken: false}, function(err, user){
              if(err){
                res.json(HttpResponse.httpResponse(false, 500, 'Server Error'));
              }
              if(!!user){
                user.verifiedToken = true;
              
                user.save(function(err){
                  if(err){
                    res.json(HttpResponse.httpResponse(false, 500, 'Server Error'));
                  }

                  res.json(HttpResponse.httpResponse(true, 200, 'Your account is activated. Please login !'));
                });
              }else{
                res.json(HttpResponse.httpResponse(false, 300, 'User Activated Already'));
              }
              
            });

        }
      });

    /*
    // Method 3 wrapper for 1 and 2
    if(!req.header('authorization')){
        return res.status(401).send({message: 'error'});
    }
    var token = req.header('authorization').split();
    var payload = jwt.decode(token, 123);
    if(!payload)
    return res.status(401).send({message: 'unauthorized request. Authentication header invalid'});
    // req.user = payload;
    // next();
    */
    
};

// POST --> /api/register
/*exports.register = function(req,res){
	if(!req.body.email || !req.body.password) {
		 res.json({ success: false, message: 'Please enter email and password.' });
		} else {
		 var newUser = new User({
		   email: req.body.email,
		   password: req.body.password
		 });

		 // Attempt to save the user
		 newUser.save(function(err) {
		   if (err) {
		     return res.json({ success: false, message: 'That email address already exists.'});
		   }
		   res.json({ success: true, message: 'Successfully created new user.' });
		 });
	}
};
*/
//POST --> /api/authenticate
exports.authenticate = function(req,res){
	User.findOne({
     email: req.body.email
		}, function(err, user) {
		 if (err) throw err;

		 if (!user) {
      res.json(HttpResponse.httpResponse(false, 300, 'Authentication failed. Please register'));
		 } else {
       if(!user.verifiedToken){
        res.json(HttpResponse.httpResponse(false, 400, 'Authentication failed. Email verification is pending'));
       }
       // Check if password matches
		   user.comparePassword(req.body.password, function(err, isMatch) {
		     if (isMatch && !err) {
           // Create token if the password matched and no error was thrown
           var token = jwt.sign({
                id: user._id,
                name: user.email,
                roles: user.roles
                },
                  systemProperties[env].sessionTokenSecret,
                  {expiresIn: systemProperties[env].sessionTokenExpiry}
                );

                res.json(HttpResponse.httpResponse(true, 200, 'Authentication Success',{token: token, email: user.email}));
		      
		     } else {
          res.json(HttpResponse.httpResponse(false, 500, 'Authentication failed. Please provide correct credentials.'));
		     }
		   });
		 }
	});
};