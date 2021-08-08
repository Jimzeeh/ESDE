// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserFnSolution = require('./middlewares/checkUserFnSolution');
const validateFn = require('./middlewares/validateFn');
const verifyFn = require('./middlewares/verifyFn');
const LoginAttempts = require('./middlewares/LoginAttempts');// Newly added code

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', /* added code */ LoginAttempts.Attempts ,authController.processLogin);
    router.post('/api/user/register', /* added code */validateFn.MustContain, authController.processRegister);
    router.post('/api/user/process-submission',/* added code */checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processDesignSubmission);
    router.put('/api/user/', verifyFn.verifyTokenUserID,/* added code */ userController.processRetrieveAdminId ,userController.processUpdateOneUser);
    router.put('/api/user/design/', /* added code */  verifyFn.verifyTokenUserID, /* added code */ validateFn.validateUpdateSubmission, /*added code*/userController.ValidateOwner,userController.processUpdateOneDesign);
    router.post('/api/user/processInvitation/',checkUserFn.getClientUserId, userController.processSendInvitation);

    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyFn.verifyTokenUserID,checkUserFn.getClientUserId,/* added code */ validateFn.validateUserSearch,userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?',  verifyFn.verifyTokenUserID,/* added code */ userController.processRetrieveAdminId ,checkUserFn.getClientUserId, userController.processGetUserData);
    router.get('/api/user/process-search-user-design/:pagenumber/:search?', verifyFn.verifyTokenUserID,/* added code */ userController.processRetrieveAdminId, userController.processGetSubmissionsbyEmail);
    router.get('/api/user/:recordId', userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', userController.processGetOneDesignData);

    router.post('/api/user/Admin', verifyFn.verifyTokenUserID, userController.processRetrieveAdminId_2); //added code
    router.post('/api/user/design/Owner', verifyFn.verifyTokenUserID, userController.ValidateOwner_2) //added code (sensitive data exposure)
};