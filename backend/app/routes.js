// create a new express routes
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    authController = require('./controllers/auth.controller'),
    taskController = require('./controllers/task.controller')

// export reroutes
module.exports = router;

// define routes
router.get('/', mainController.signIn);
router.get('/user', mainController.user);
router.get('/timer', taskController.timerPage);
router.post('/timer', taskController.timerNewTask);
router.get('/logout', mainController.logout);
router.post('/signin', mainController.signInValidation);
router.post('/auth/reset-password', authController.resetPass);
router.get('/auth/check-username/:username', authController.checkUser);
router.post('/auth/signup', authController.signUp);
router.get('/auth/security-question/:username', authController.secQuestion);
router.get('/auth/reset-password', authController.resetPass);