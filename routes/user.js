const express = require('express');
const { userAuthGoogle, getUserAuthFromToken, getUserDetailToken, getUserInfoFromToken, addToCartRemove, userOrderPaymentRedirect, userOrderPaymentCallback, createOrder, getAllUsersDetails, getAUserDetails } = require('../controllers/user');
const route = express.Router();





route.post('/user/auth/google', userAuthGoogle);
route.get('/user/data', getUserAuthFromToken);
route.get('/get/user/details', getUserDetailToken);



// User Create Order 

route.post('/create/order', getUserInfoFromToken, createOrder);

// User Order Payment

route.post("/payment/redirect", userOrderPaymentRedirect);
route.post("/payment/callback", userOrderPaymentCallback);





// User Cart Segment
route.post('/user/add/cart', getUserInfoFromToken, addToCartRemove);


// Get All Users

route.get('/users/get/all', getAllUsersDetails);
route.get('/get/a/user/:userId', getAUserDetails);

module.exports = route;