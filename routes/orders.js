const express = require('express');
const { getAllOrders, getAOrderDetail } = require('../controllers/orders');
const route = express.Router();



route.get("/get/all/orders", getAllOrders);
route.get("/get/a/order/:orderID", getAOrderDetail);

module.exports = route;