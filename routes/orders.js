const express = require('express');
const { getAllOrders, getAOrderDetail, changeTheOrderStatus, getAllOrderBasedOnStatus } = require('../controllers/orders');
const route = express.Router();



route.get("/get/all/orders", getAllOrders);
route.get("/get/a/order/:orderID", getAOrderDetail);


route.post("/change/order/status", getAllOrderBasedOnStatus);

module.exports = route;