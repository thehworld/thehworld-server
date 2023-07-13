const pigcolor = require('pigcolor');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const User = require('../models/users');

exports.userAuthGoogle = (req, res) => {
    pigcolor.box("User: Auth Google");
    console.log(req.body);
    if (!req.body)
        return res.status(400).json({
            error: "Empty payload!!"
        })
    User.findOne({ userEmail: req.body.user.email }).then((user, err) => {
        // console.log(user, err);
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
    console.log(req.headers.token);
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