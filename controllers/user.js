const pigcolor = require('pigcolor');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const User = require('../models/users');

exports.userAuthGoogle = (req, res) => {
    pigcolor.box("User: Auth Google");
    // console.log(req.body);
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
            console.log(user);
            if (!user) {
                return res.json({
                    status: false
                })
            } else {
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