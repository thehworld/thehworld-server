const pigcolor = require('pigcolor');
const Order = require("../models/orders");

exports.createOrder = (req, res) => {
    pigcolor.box("Create: New Order");

}


exports.editOrder = (req, res) => {
    pigcolor.box("Edit: Order");
}

exports.deleteOrder = (req, res) => {
    pigcolor.box("Delete: Order");
}


// * Get All Details Here

exports.getAllOrders = (req, res) => {
    pigcolor.box("Get: All Orders");
    Order.find({}).then((order, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (!order) {
            return res.json({
                error: "Order Empty"
            })
        }
        return res.json({
            orders: order
        })
    }).catch((error) => {
        return res.json({
            error: error
        })
    })
}


exports.getAOrderFromUser = (req, res) => {
    pigcolor.box("Get A: Order");
}