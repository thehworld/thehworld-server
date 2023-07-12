const express = require('express');
const { userAuthGoogle, getUserAuthFromToken, getUserDetailToken, getUserInfoFromToken, addToCartRemove } = require('../controllers/user');
const route = express.Router();



route.post('/user/auth/google', userAuthGoogle);
route.get('/user/data', getUserAuthFromToken);
route.get('/get/user/details', getUserDetailToken);

// User Cart Segment
route.post('/user/add/cart', getUserInfoFromToken, addToCartRemove);



module.exports = route;