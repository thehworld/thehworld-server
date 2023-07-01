const Pig = require('pigcolor');
const Order = require("../models/orders");

exports.createOrder = (req, res) => {
    Pig.box("Create: New Order");
    
}


exports.editOrder = (req, res) => {
    Pig.box("Edit: Order");
}

exports.deleteOrder = (req, res) => {
    Pig.box("Delete: Order");
}