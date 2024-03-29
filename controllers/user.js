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
    console.log(req.body);
    if (!req.body)
        return res.status(400).json({
            error: "Empty payload!!"
        })
    User.findOne({ userEmail: req.body.user.email }).then(async (user, err) => {
        console.log(user, err);
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!user) {
            console.log("New User - ", user);
            let data = {
                userId: req.body.user.sub,
                userName: req.body.user.given_name,
                userGoogleName: req.body.user.name,   
                userProfilePic: req.body.user.picture,
                userEmail: req.body.user.email,
                userAuthCode: uuidv4()
               };
            let newdata = await User.create(data)
            var token = jwt.sign({ usertoken: newdata.userId }, 'THEHWORLDSECRET', {
                expiresIn: '1d'
            });
            return res.json({
                token: token
            })
           
        } else {
            console.log("User Exist - ", user);
            var token = jwt.sign({ usertoken: user.userId }, 'THEHWORLDSECRET', {
                expiresIn: '1d' // expires in 365 days
            });
            return res.json({
                token: token
            })
        }

    }).catch((error) => {
        console.log("Error - ", error);
    });
}

exports.getUserAuthFromToken = async(req, res) => {
    pigcolor.box("Get: User Details From Token");
    // console.log(req.headers.token);
    const user_token = req.headers.token;
    const user_data = await jwt_decode(user_token);
    console.log("user data",user_data);
    if (user_data) {
        console.log(user_data);
        User.findOne({ userId: user_data.usertoken }).then((user, err) => {
            console.log("user data from db",user);
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
                    console.log("User has orders");
                    Order.find({}).where("_id").in(user.userOrders).exec().then((orders, err) => {
                        console.log("Orders - ", orders, err);
                        if (err) {
                            return res.json({
                                status: false
                            })
                        }
                        if (orders.length > 0)
                            return res.json({
                                status: true,
                                user: user,
                                orders: orders
                            })

                    }).catch((err) => {
                        return res.json({
                            status: false
                        })
                    })
                } else {
                    return res.json({
                        status: true,
                        user: user
                    })
                }


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
    // console.log("USer: ", req.user);

    if (req.body.paymentOptions === "CARD") {
        const user_token = req.headers.token;
        const user_data = jwt_decode(user_token);
        if (user_data) {
            console.log(user_data);
            User.findOne({ userId: user_data.usertoken }).then((user, err) => {
                // console.log("User - ", user);



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
                newOrder.shipmentPincode = req.body.userAddressPincode;
                newOrder.shipmentAddress = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                newOrder.shipmentState = req.body.userState;
                newOrder.shipmentCityTown = req.body.userTown;
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
                    // console.log("Order Saved - ", order);


                    // Order Created Success
                    // Handle Missing Fileds In User Profile
                    if (!user.contactNumber)
                        user.contactNumber = req.body.userPhone
                    if (!user.contactWAForAuto)
                        user.contactWAForAuto = req.body.userWAPhone
                    if (!user.userState)
                        user.userState = req.body.userState
                    if (!user.userTown)
                        user.userTown = req.body.userTown
                    if (!user.userHome)
                        user.userHome = req.body.userHome
                    if (!user.userAddressPincode)
                        user.userAddressPincode = req.body.userAddressPincode
                    if (user.userAddresses.length < 1 || user.userAddresses === undefined) {
                        console.log("user.userAddress", user.userAddress);

                        let address_new = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                        let address_list = []
                        address_list.push(address_new);
                        user.userAddresses = address_list;
                    } else if (user.userAddresses.length >= 1) {
                        let address_lists = [];
                        console.log(user.userAddresses);
                        address_lists = user.userAddresses;
                        let address_new = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                        address_lists.push(address_new);
                        user.userAddresses = address_lists;
                    }


                    let user_order_list = user.userOrders;
                    user_order_list.push(order._id);
                    user.userOrders = user_order_list;
                    user.save().then((userOrder, err) => {
                        console.log("User Order Test - ", userOrder);
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

                        // Payment Block Begins Here

                        // Generate PhonePe Payment Body
                        const PhonePePaymentBody = {
                            "merchantId": "THEHWORLDONLINE",
                            "merchantTransactionId": order.orderId,
                            "merchantUserId": "MUID123",
                            "amount": order.orderTotal * 100,
                            "redirectUrl": "https://thehworld.in/order/payment",
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
                        var salt = "17cfc168-1045-43cb-88b1-ad26c042f233"
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
                            url: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
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


                        // Payment Block Ends Here


                    }).catch((error) => {
                        console.log("User Order Update Error", err);
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

    } else if (req.body.paymentOptions === "COD") {
        const user_token = req.headers.token;
        const user_data = jwt_decode(user_token);
        if (user_data) {
            console.log(user_data);
            User.findOne({ userId: user_data.usertoken }).then((user, err) => {
                // console.log("User - ", user);



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
                newOrder.shipmentPincode = req.body.userAddressPincode;
                newOrder.shipmentAddress = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                newOrder.shipmentState = req.body.userState;
                newOrder.shipmentCityTown = req.body.userTown;
                newOrder.shipmentToken = uuidv4();
                newOrder.paymentResponse = {

                    success: true,
                    code: "COD_SUCCESS",
                    message: "Your payment is successful.",
                    data: {
                        paymentInstrument: {
                            type: "COD"
                        }
                    }
                };

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
                    // console.log("Order Saved - ", order);


                    // Order Created Success
                    // Handle Missing Fileds In User Profile
                    if (!user.contactNumber)
                        user.contactNumber = req.body.userPhone
                    if (!user.contactWAForAuto)
                        user.contactWAForAuto = req.body.userWAPhone
                    if (!user.userState)
                        user.userState = req.body.userState
                    if (!user.userTown)
                        user.userTown = req.body.userTown
                    if (!user.userHome)
                        user.userHome = req.body.userHome
                    if (!user.userAddressPincode)
                        user.userAddressPincode = req.body.userAddressPincode
                    if (user.userAddresses.length < 1 || user.userAddresses === undefined) {
                        console.log("user.userAddress", user.userAddress);

                        let address_new = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                        let address_list = []
                        address_list.push(address_new);
                        user.userAddresses = address_list;
                    } else if (user.userAddresses.length >= 1) {
                        let address_lists = [];
                        console.log(user.userAddresses);
                        address_lists = user.userAddresses;
                        let address_new = req.body.userAddress + ", " + req.body.userAddressTwo + ", " + req.body.userCityTown + ", " + req.body.userState;
                        address_lists.push(address_new);
                        user.userAddresses = address_lists;
                    }


                    let user_order_list = user.userOrders;
                    user_order_list.push(order._id);
                    user.userOrders = user_order_list;
                    user.userCart = [];
                    user.save().then((userOrder, err) => {
                        console.log("User Order Test - ", userOrder);
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
                        return res.json({
                                orderCycle: true,
                                orderCart: userOrder,
                                userRedirect: true
                            })
                            // COD Payment Method
                    })


                    // 






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
}

exports.getOrdersUnderUser = (req, res) => {
    pigcolor.box("Get: A Order From User");
    const ordersIds = req.body.orders;
    Order.find({}).where("_id").in(ordersIds).exec().then((orders, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (!orders) {
            return res.json({
                msg: "Orders Is Empty!!"
            })
        }
        return res.json({
            orders: orders
        })
    }).catch((err) => {
        console.log("Error - ", err);
    });
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
        // console.log(user_data);
        User.findOne({ userId: user_data.usertoken }).then((user, err) => {
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

            if (req.body.product.qty < 1) {
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
            } 

            else{
            const cart_list = req.user.userCart;
            cart_list[isProductExistInCartIndex] = {
                id: req.body.product.id,
                product: req.body.product.product, 
                qty: req.body.product.qty
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
        }
        } else {
            const cart_object = req.body.product;
            let new_cart_list = req.user.userCart;
            if (req.body.product.qty < 1) {
               return res.json({
                    data: ""
                })
            }
            else{
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

exports.removeCartFromCartSection = (req, res) => {
   
    pigcolor.box("Remove: Product from Cart");
    
    User.findOne({ useId: req.user.userId }).then(async (user, err) => {
        console.log("User - ", user, err);

        if (err) {
            return res.json({
                error: err
            })
        }
        if (!user) {
            return res.json({
                error: "User Not Available"
            })
        }
        const temp_cart = user.userCart;
        let tempt_cart_index_to_remove = await temp_cart.findIndex((c) => c.id === req.body.id);
        await temp_cart.splice(tempt_cart_index_to_remove, 1);
        console.log("Cart Index - ", temp_cart);
        user.userCart = temp_cart;
        user.save().then((cartuser, err) => {
            console.log("Cart New - ", cartuser, err);

            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                cartuser: cartuser
            })
        }).catch((err) => {
            return res.json({
                error: err
            })
        })

    }).catch((error) => {
        return res.json({
            error: "User Not Available"
        })
    });
}


// ?? All Users Data
exports.getAllUsersDetails = (req, res) => {
    pigcolor.box("Get All: Users");
    User.find({})
    .select({
        userGoogleName:1,
        userProfilePic:1,
        userEmail:1,
        contactNumber:1,
        contactWAForAuto:1,
        userId:1
    })
    .then((allUsers, error) => {
        if (error) {
            return res.json({
                error: error
            })
        }
        return res.json({
            allUsers: allUsers
        })
    }).catch((err) => {
        return res.json({
            error: err
        })
    })
}

exports.getAUserDetails = (req, res) => {
    pigcolor.box("Get: A User");
    User.findOne({ userId: req.params.userId }).then((user, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (!user) {
            return res.json({
                msg: "User Not Available"
            })
        }
        if (user.userOrders.length > 0) {
            Order.find({}).where("_id").in(user.userOrders).exec().then((orders, err) => {
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                if (!orders) {
                    return res.json({
                        error: "Order list not showing"
                    })
                } else {
                    return res.json({
                        user: user,
                        orders: orders
                    })
                }
            }).catch((err) => {
                return res.json({
                    error: err
                })
            })

        } else
            return res.json({
                user: user
            })
    }).catch((err) => {
        console.log("Error - ", err);
    });
}


// ?? Payment Order Check
exports.checkPaymentOfAOrder = (req, res) => {
    pigcolor.box("Order: Get All Payment Check");
    console.log("Res Body Payment Check - ", req.body.orderID);

    const merchantId = "THEHWORLDONLINE";
    const merchantTransactionId = req.body.orderID;
    const pre_X_VERIFY = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + "17cfc168-1045-43cb-88b1-ad26c042f233"
    const X_VERIFY_TEMP = SHA256(pre_X_VERIFY)
    const X_VERIFY_INIT = X_VERIFY_TEMP + "###1";
    const X_MERC_ID = "THEHWORLDONLINE";

    console.log("pre_X_VERIFY - ", pre_X_VERIFY);
    console.log("X_VERIFY_TEMP - ", X_VERIFY_TEMP);
    console.log("X_VERIFY_INIT - ", X_VERIFY_INIT);
    console.log("X_MERC_ID - ", X_MERC_ID);

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            'X-VERIFY': X_VERIFY_INIT,
            'X-MERCHANT-ID': 'THEHWORLDONLINE'
        }
    };

    axios.request(config).then((response) => {
        console.log(response.data);
        return res.json({
            paymentStatus: response.data
        })
    }).catch((err) => {
        console.log("Error - ", err);
        return res.json({
            error: true
        })
    });



}