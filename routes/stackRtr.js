var techStackSvc = require('../services/stackSvc');

module.exports = function (router) {
	// get post delete put
  router.get('/stacks/:name',
        techStackSvc.getstacksByNameMatch);
  
  /*router.put('/techStacks',
        authSvc.updateTechStack);
  router.put('/techStacks',
        authSvc.updateTechStack);
   
  router.get('/resendToken',
        authSvc.resendToken);
  router.get('/login',
        authSvc.login);*/
 
  return router;
};