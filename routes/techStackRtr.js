var techStackSvc = require('../services/techStackSvc');

module.exports = function (router) {
	// get post delete put
  router.get('/techStacks',
        techStackSvc.getTechStacks);
  router.post('/techStacks',
        techStackSvc.createTechStack);
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