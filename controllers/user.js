const pigcolor = require('pigcolor');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
var base64 = require('base-64');
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
const { Base64 } = require('js-base64');
const axios = require('axios');


const User = require('../models/users');
const Order = require('../models/orders');

exports.userAuthGoogle = (req, res) => {
    pigcolor.box("User: Auth Google");
    // console.log(req.body);
    if (!req.body)
        return res.status(400).json({
            error: "Empty payload!!"
        })
    User.findOne({ userEmail: req.body.user.email }).then((user, err) => {
        console.log(user, err);
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!user) {
            console.log("New User - ", user);
            const newUser = new User();
            newUser.userId = req.body.user.sub;
            newUser.userName = req.body.user.given_name;
            newUser.userGoogleName = req.body.user.name;
            newUser.userProfilePic = req.body.user.picture;
            newUser.userEmail = req.body.user.email;
            const authCodeHere = uuidv4();
            newUser.userAuthCode = authCodeHere;
            newUser.save().then((newUser, err) => {
                console.log("newUser - ", newUser, err);
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                var token = jwt.sign({ usertoken: authCodeHere, user: newUser }, 'THEHWORLDSECRET');
                return res.json({
                    token: token
                })
            }).catch((err) => {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            })
        } else {
            console.log("User Exist - ", user);
            var token = jwt.sign({ usertoken: user.userId, user: user }, 'THEHWORLDSECRET');
            return res.json({
                token: token
            })
        }

    }).catch((error) => {
        console.log("Error - ", error);
    });


    console.log("Req Data - ", req.body);


    // User.findOne({userEmail: req.body.email});


}

exports.getUserAuthFromToken = (req, res) => {
    pigcolor.box("Get: User Details From Token");
    // console.log(req.headers.token);
    const user_token = req.headers.token;
    const user_data = jwt_decode(user_token);
    if (user_data) {
        console.log(user_data);
        User.findOne({ userId: user_data.user.userId }).then((user, err) => {
            if (err) {
                return res.json({
                    status: false
                })
            }
            if (!user) {
                return res.json({
                    status: false
                })
            } else {
                console.log("user - ", user);
                if (user.userOrders.length > 0) {
                    Order.find({}).where("_id").in(user.userOrder).exec().then((orders, err) => {
                        if (err) {
                            return res.json({
                                status: false
                            })
                        }
                        return res.json({
                            status: true,
                            user: user,
                            orders: orders
                        })

                    }).catch(err => {
                        return res.json({
                            status: false
                        })
                    })
                }
                return res.json({
                    status: true,
                    user: user
                })

            }
        }).catch((err) => {
            return res.json({
                status: false
            })
        })
    }
}


exports.getUserDetailToken = (req, res) => {
    pigcolor.box("Get: User Details From Token");
    const user_token = req.headers.token;

}


// ?? User Order

exports.createOrder = (req, res) => {
    pigcolor.box("Create: Order");

    console.log("Order: ", req.body);
    console.log("USer: ", req.user);


    const user_token = req.headers.token;
    const user_data = jwt_decode(user_token);
    if (user_data) {
        console.log(user_data);
        User.findOne({ userId: user_data.user.userId }).then((user, err) => {
            console.log("User - ", user);



            const merchantOrderId = uuidv4();

            const newOrder = new Order();
            newOrder.orderId = merchantOrderId;
            newOrder.orderNotes = req.body.userOrderNote;
            newOrder.orderSubTotal = req.body.userOrderSubTotal;
            newOrder.orderTotal = req.body.userOrderGrandTotal;
            newOrder.orderisOffer = uuidv4();
            newOrder.orderBy = uuidv4();
            newOrder.orderUpdateWAPhone = req.body.userWAPhone;
            newOrder.orderProduct = req.body.userOrderProduct;

            // Payment
            newOrder.paymentId = merchantOrderId;
            newOrder.paymentToken = uuidv4();
            newOrder.paymentTotal = req.body.userOrderGrandTotal;
            // newOrder.paymentMethod = req.body.paymentMethod;

            // *++ User 
            newOrder.orderForUser = user._id;
            // Shipment
            newOrder.shipmentId = merchantOrderId;
            newOrder.shipmentPincode = req.body.userPincode;
            newOrder.shipmentAddress = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
            newOrder.shipmentState = req.body.userState;
            newOrder.shipmentCityTown = req.body.userCityTown;
            newOrder.shipmentToken = uuidv4();

            newOrder.save().then((order, err) => {
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                if (!order) {
                    return res.json({
                        error: "Order: Failure"
                    })
                }
                console.log("Order Saved - ", order);


                // Order Created Success
                // Handle Missing Fileds In User Profile
                if (!user.contactNumber)
                    user.contactNumber = req.body.userPhone
                if (!user.contactWAForAuto)
                    user.contactWAForAuto = req.body.userWAPhone
                if (!user.userAddresses)
                    user.userAddresses = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;


                let user_order_list = user.userOrders;
                user_order_list.push(order._id);
                user.userOrders = user_order_list;
                user.save().then((userOrder, err) => {
                    if (err) {
                        return res.json({
                            error: err
                        })
                    }
                    if (!userOrder) {
                        return res.json({
                            error: err
                        })
                    }



                    // Generate PhonePe Payment Body
                    const PhonePePaymentBody = {
                        "merchantId": "PGTESTPAYUAT65",
                        "merchantTransactionId": order.orderId,
                        "merchantUserId": "MUID123",
                        "amount": order.orderTotal * 100,
                        "redirectUrl": "https://vocal-cassata-37976e.netlify.app/order/payment",
                        "redirectMode": "REDIRECT",
                        "callbackUrl": "https://thehworld-service-commerce.onrender.com/api/web/payment/callback",
                        "mobileNumber": order.orderUpdateWAPhone,
                        "paymentInstrument": {
                            "type": "PAY_PAGE"
                        }
                    }
                    console.log("Generated Payment Body - ", PhonePePaymentBody);
                    var encodedData = base64.encode(JSON.stringify(PhonePePaymentBody));
                    console.log("Generated Payment Body Base64 - ", encodedData);
                    var salt = "c744c61e-b5a6-4be0-ac47-cc1b23788e60"
                    var x_verify_payload = encodedData + "/pg/v1/pay" + salt
                    console.log("x-verify Payload - ", x_verify_payload);
                    var x_verify = SHA256(x_verify_payload) + "###1";
                    console.log("x-verify  - ", x_verify);


                    var redirect = "https://thehworld-service-commerce.onrender.com/api/web/payment/redirect";
                    var callback = "https://thehworld-service-commerce.onrender.com/api/web/payment/callback";

                    // Request to Payment Gateway

                    let data = JSON.stringify({
                        "request": encodedData
                    });
                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-VERIFY': x_verify
                        },
                        data: data
                    };

                    axios.request(config).then((response) => {
                        console.log(response.data);
                        return res.json({
                                paymentURlredirect: response.data.instrumentResponse,
                                paymentObject: response.data,
                                paymentStatus: true
                            })
                            // console.log("Payment Res - ", response);


                    }).catch((err) => {
                        console.log("Error - ", err);
                    });



                }).catch((error) => {
                    onsole.log("User Order Update Error", err);
                    return res.json({
                        error: err
                    })
                })




            }).catch((err) => {
                console.log("Create Order Complete Error", err);
                return res.json({
                    error: err
                })
            })





        }).catch((err) => {
            return res.json({
                status: false
            })
        })






    }

}


// ?? User Payment

exports.userOrderPaymentRedirect = (req, res) => {
    console.log("Payment Redirect - ", req.body);
    res.send("Success Payment");
}

exports.userOrderPaymentCallback = (req, res) => {
    console.log("Payment Calback - ", req.body);
    console.log("Payment Calback - ", req.headers);
    const decode_payment = base64.decode(req.body.response);
    console.log("Decode Payment Response - ", JSON.parse(decode_payment));
    const decode_payment_object = JSON.parse(decode_payment);
    console.log("Decode Payment Response Data - ", decode_payment_object.data);
    const order_ID = decode_payment_object.data.merchantTransactionId;

    Order.findOne({ orderId: order_ID }).then((order, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (!order) {
            return res.json({
                error: "Order doesn't exist"
            })
        }
        order.paymentResponse = decode_payment_object;
        // order.paymentResponse = decode_payment.data.paymentInstrument.type;
        order.save().then((newOrder, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            console.log("Payment Order -> ", newOrder);
            User.findOne({ _id: newOrder.orderForUser }).then((user, err) => {
                user.userCart = [];
                user.save().then((cal, err) => {
                    if (err) {
                        return res.json({
                            error: err
                        })
                    }
                    return res.json({
                        orderCycle: true,
                        orderCart: cal
                    })
                });
            }).catch((err) => {
                return res.json({
                    error: err
                })
            })

        });
    }).catch((error) => {
        return res.json({
            error: err
        })
    })

    // * Steps to Verify the Payment Process

    console.log();




}

// ?? Middleware

exports.getUserInfoFromToken = (req, res, next) => {
    const user_token = req.headers.token;
    const user_data = jwt_decode(user_token);
    if (user_data) {
        console.log(user_data);
        User.findOne({ userId: user_data.user.userId }).then((user, err) => {
            if (err) {
                return res.json({
                    status: false
                })
            }
            console.log(user);
            if (!user) {
                return res.json({
                    status: false
                })
            } else {
                req.user = user;
                next();

            }
        }).catch((err) => {
            return res.json({
                status: false
            })
        })
    }
}


// ?? Cart

exports.addToCartRemove = (req, res) => {
    const user_cart = req.user.userCart;
    pigcolor.box("Cart: Add/Remove Product");
    if (user_cart.length > 0 && req.body.opt === "Add") {
        // console.log("User Cart Present - ", req.user.userCart, req.body.product);
        const isProductExistInCart = req.user.userCart.filter((p) => p.id === req.body.product.id);
        const isProductExistInCartIndex = req.user.userCart.findIndex((p) => p.id === req.body.product.id);
        if (isProductExistInCart[0]) {
            const cart_list = req.user.userCart;
            cart_list[isProductExistInCartIndex] = {
                id: req.body.product.id,
                product: req.body.product.product,
                qty: isProductExistInCart[0].qty + 1
            }
            User.updateOne({ userId: req.user.userId }, {
                userCart: cart_list
            }).then((user, err) => {
                console.log("user - ", user, err);
                return res.json({
                    data: user
                })
            }).catch((err) => {
                console.log("Error - ", err);
            });
        } else {
            const cart_object = req.body.product;
            let new_cart_list = req.user.userCart;
            new_cart_list.push(cart_object);
            User.updateOne({ userId: req.user.userId }, {
                userCart: new_cart_list
            }).then((user, err) => {
                console.log("user - ", user, err);
                return res.json({
                    data: user
                })
            }).catch((err) => {
                console.log("Error - ", err);
            });
        }
    } else if (user_cart.length > 0 && req.body.opt === "Rmv") {
        console.log("Remove");
        const isProductExistInCart = req.user.userCart.filter((p) => p.id === req.body.product.id);
        const isProductExistInCartIndex = req.user.userCart.findIndex((p) => p.id === req.body.product.id);
        if (isProductExistInCart[0]) {
            if (isProductExistInCart[0].qty < 2) {
                let new_list_cart = req.user.userCart;
                new_list_cart.splice(isProductExistInCartIndex, 1);
                User.updateOne({ userId: req.user.userId }, {
                    userCart: new_list_cart
                }).then((user, err) => {
                    console.log("user - ", user, err);
                    return res.json({
                        data: user
                    })
                });
            } else {
                const cart_list = req.user.userCart;
                console.log("Here - ");
                cart_list[isProductExistInCartIndex] = {
                    id: req.body.product.id,
                    product: req.body.product.product,
                    qty: isProductExistInCart[0].qty - 1
                }
                User.updateOne({ userId: req.user.userId }, {
                    userCart: cart_list
                }).then((user, err) => {
                    console.log("user - ", user, err);
                    return res.json({
                        data: user
                    })
                });
            }
        }
    } else {
        const cart_object = req.body.product;
        let new_cart_list = [];
        new_cart_list.push(cart_object);
        User.updateOne({ userId: req.user.userId }, {
            userCart: new_cart_list
        }).then((user, err) => {
            console.log("user - ", user, err);
            return res.json({
                data: user
            })
        }).catch((err) => {
            console.log("Error - ", err);
        });
    }
}