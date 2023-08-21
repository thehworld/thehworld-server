const express = require('express');
const { getAllOrders, getAOrderDetail, changeTheOrderStatus, getAllOrderBasedOnStatus, changeOrderStatus, changeOrderStatusUser } = require('../controllers/orders');
const route = express.Router();



route.get("/get/all/orders", getAllOrders);
route.get("/get/a/order/:orderID", getAOrderDetail);


route.post("/change/order/status", getAllOrderBasedOnStatus);
route.post("/order/change/shipment", changeOrderStatus);
route.post("/order/change/shipment/user", changeOrderStatusUser);

module.exports = route;