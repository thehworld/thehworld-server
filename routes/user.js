const express = require('express');
const { userAuthGoogle, getUserAuthFromToken } = require('../controllers/user');
const route = express.Router();



route.post('/user/auth/google', userAuthGoogle);
route.get('/user/data', getUserAuthFromToken);



module.exports = route;