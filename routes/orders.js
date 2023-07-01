const express = require('express');
const route = express.Router();


route.post("/order/new", createOrder);



module.exports = route;