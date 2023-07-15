const express = require('express');
const { getAllOrders } = require('../controllers/orders');
const route = express.Router();


route.post("/order/new", createOrder);

route.get("/get/all/orders", getAllOrders);


module.exports = route;