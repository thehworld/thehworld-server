const pigcolor = require('pigcolor');
const Order = require("../models/orders");
const User = require("../models/users");

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

exports.getAOrderDetail = (req, res) => {
    pigcolor.box("Get A: Order Detail");
    console.log(req.params);
    Order.findOne({ _id: req.params.orderID }).then((order, err) => {
        if (err) {
            return res.json({
                order: order
            })
        }
        if (!order) {
            return res.json({
                error: "Order Id not Found"
            })
        }
        User.findOne({ _id: order.orderForUser }).then((user, err) => {

            if (err) {
                return res.json({
                    order: order
                })
            }
            return res.json({
                order: order,
                user: user
            })
        }).catch((err) => {
            return res.json({
                order: order
            })
        });


    }).catch((error) => {
        console.log("Error - ", error);
    });
}




exports.getAOrderFromUser = (req, res) => {
    pigcolor.box("Get A: Order");
}




// Order Status Changer

exports.getAllOrderBasedOnStatus = (req, res) => {
    pigcolor.box("Get Order: Status Based Change");
    console.log(req.body);
    Order.find({ orderStatus: req.body.status.status }).then((order, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        console.log(order);
        return res.json({
            order: order
        })
    }).catch((err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
    })



}

exports.changeOrderStatus = (req, res) => {
    pigcolor.box("Change: Order Status");
    console.log(req.body);
    Order.findOne({ _id: req.body.status.id }).then((order, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        console.log(order);
        order.orderStatus = req.body.status.status;
        order.save().then((newOrder, err) => {

            if (err) {
                return res.json({
                    error: err
                })
            }
            if (!newOrder) {
                return res.json({
                    error: "Order don't exist"
                })
            }

            return res.json({
                order: newOrder
            })

        }).catch((error) => {
            return res.json({
                error: error
            })
        });

    }).catch((err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
    })

}