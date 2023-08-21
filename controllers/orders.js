const pigcolor = require('pigcolor');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
var base64 = require('base-64');
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
const { Base64 } = require('js-base64');
const axios = require('axios');

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
        // if (req.body.status.status === "REFUND INIT") {

        //     // Generate PhonePe Payment Body
        //     const PhonePePaymentBody = {
        //         "merchantId": "THEHWORLDONLINE",
        //         "merchantTransactionId": req.body.status.orderId,
        //         "transactionId": req.body.status.orderId,
        //         "providerReferenceId": req.body.status.paymentResponse.data.transactionId,
        //         "amount": req.body.status.orderTotal * 100,
        //         "merchantOrderId": req.body.status.orderId,
        //         "message": "refund for cancelled order"
        //     }
        //     console.log("Generated Payment Body - ", PhonePePaymentBody);
        //     var encodedData = base64.encode(JSON.stringify(PhonePePaymentBody));
        //     console.log("Generated Payment Body Base64 - ", encodedData);
        //     var salt = "17cfc168-1045-43cb-88b1-ad26c042f233"
        //     var x_verify_payload = encodedData + "/v3/credit/backToSource" + salt
        //     console.log("x-verify Payload - ", x_verify_payload);
        //     var x_verify = SHA256(x_verify_payload) + "###1";
        //     console.log("x-verify  - ", x_verify);



        //     let data = JSON.stringify({
        //         "request": encodedData
        //     });
        //     let config = {
        //         method: 'post',
        //         maxBodyLength: Infinity,
        //         url: 'https://api.phonepe.com/apis/hermes/pg/v1/refund',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'X-VERIFY': x_verify
        //         },
        //         data: data
        //     };

        //     axios.request(config).then((response) => {
        //         console.log(response.data);
        //         if (response.data.success) {
        //             order.orderStatus = "REFUNDED";
        //             order.save().then((newOrder, err) => {

        //                 if (err) {
        //                     return res.json({
        //                         error: err
        //                     })
        //                 }
        //                 if (!newOrder) {
        //                     return res.json({
        //                         error: "Order don't exist"
        //                     })
        //                 }

        //                 return res.json({
        //                     order: newOrder,
        //                     paymentURlredirect: response.data.instrumentResponse,
        //                     paymentObject: response.data,
        //                     paymentStatus: true
        //                 })

        //             }).catch((error) => {
        //                 return res.json({
        //                     error: error
        //                 })
        //             });
        //         }


        //     }).catch((err) => {
        //         console.log("Error - ", err);
        //     });


        // } else {

        //     order.save().then((newOrder, err) => {

        //         if (err) {
        //             return res.json({
        //                 error: err
        //             })
        //         }
        //         if (!newOrder) {
        //             return res.json({
        //                 error: "Order don't exist"
        //             })
        //         }

        //         return res.json({
        //             order: newOrder
        //         })

        //     }).catch((error) => {
        //         return res.json({
        //             error: error
        //         })
        //     });
        // }


    }).catch((err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
    })

}