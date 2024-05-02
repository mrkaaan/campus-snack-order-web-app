const express = require('express');
const { login, register,registerDemo, logout, loginAsGuest  } = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(logout);
router.route('/registerDemo').get(registerDemo);
router.route('/login-guest').post(loginAsGuest);

module.exports = router;
