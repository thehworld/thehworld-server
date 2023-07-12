const express = require('express');
const { userAuthGoogle, getUserAuthFromToken, getUserDetailToken } = require('../controllers/user');
const route = express.Router();



route.post('/user/auth/google', userAuthGoogle);
route.get('/user/data', getUserAuthFromToken);
route.get('/get/user/details', getUserDetailToken);



module.exports = route;