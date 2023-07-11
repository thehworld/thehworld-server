const express = require('express');
const { userAuthGoogle } = require('../controllers/user');
const route = express.Router();



route.post('/user/auth/google', userAuthGoogle);




module.exports = route;