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

  var newUser = new User({ 
    email: email, 
    password: bcrypt.hashSync(password)
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

      res.json(HttpResponse.httpResponse(true, 200, 'Registered Successfully!',
                 {token: token, email: user.email}));
    }
  });
  
};

exports.verify = function(req,res){
    var token = req.query.token;
   
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

    
};


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