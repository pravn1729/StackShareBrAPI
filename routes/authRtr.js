var authSvc = require('../services/authSvc');

module.exports = function (router) {
	// get post delete put
  router.post('/register',
        authSvc.register);
  router.get('/verify',
        authSvc.verify);
  router.get('/authenticate',
        authSvc.authenticate);
   /*
  router.get('/resendToken',
        authSvc.resendToken);
  router.get('/login',
        authSvc.login);*/
 
  return router;
};