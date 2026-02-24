const express = require('express');
const router = express.Router();
const { register, login, checkEmail } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateEmailCheck } = require('../middleware/validateRequest');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/check-email', validateEmailCheck, checkEmail);

module.exports = router;