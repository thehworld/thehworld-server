const express = require('express');
const { getAllOrders } = require('../controllers/orders');
const route = express.Router();



route.get("/get/all/orders", getAllOrders);


module.exports = route;