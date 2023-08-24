const express = require('express');
const { userAuthGoogle, getUserAuthFromToken, getUserDetailToken, getUserInfoFromToken, addToCartRemove, userOrderPaymentRedirect, userOrderPaymentCallback, createOrder, getAllUsersDetails, getAUserDetails, getOrdersUnderUser, removeCartFromCartSection, checkPaymentOfAOrder } = require('../controllers/user');
const { getAllDashboardDetails, viewStatusMake, viewStatusMakeProduct } = require('../controllers/dash');
const { createOfferCode, getAllOfferCode, getOfferCodeValue } = require('../controllers/offer');
const { issueProblem } = require('../controllers/issues');
const route = express.Router();





route.post('/user/auth/google', userAuthGoogle);
route.get('/user/data', getUserAuthFromToken);
route.get('/get/user/details', getUserDetailToken);



// User Create Order 

route.post('/create/order', getUserInfoFromToken, createOrder);
route.get('/get/orders/under/user/:userID', getOrdersUnderUser);
// User Order Payment

route.post("/payment/redirect", userOrderPaymentRedirect);
route.post("/payment/callback", userOrderPaymentCallback);

// User Order Payment Check
route.post("/check/a/payment", checkPaymentOfAOrder);



// User Cart Segment
route.post('/user/add/cart', getUserInfoFromToken, addToCartRemove);
route.post('/remove/cart', getUserInfoFromToken, removeCartFromCartSection);

// Get All Users

route.get('/users/get/all', getAllUsersDetails);
route.get('/get/a/user/:userId', getAUserDetails);



// Portion for Admin Dashboad
route.get('/get/dash/stats', getAllDashboardDetails);
route.post('/status/update', viewStatusMake);
route.post('/status/update/product', viewStatusMakeProduct);


// Offer
route.post('/create/offer/code', createOfferCode);
route.get('/get/all/offers', getAllOfferCode);
route.get('/get/offer/:code', getOfferCodeValue);

// Issues
route.post('/problem/order', issueProblem);

module.exports = route;