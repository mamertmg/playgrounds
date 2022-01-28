const express = require ('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/signup', userController.getSignup);

router.post('/signup', userController.signup);

router.get('/login', userController.getLogin);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

module.exports = router;