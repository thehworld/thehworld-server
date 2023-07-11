const pigcolor = require('pigcolor');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.userAuthGoogle = (req, res) => {
    pigcolor.box("User: Auth Google");
    console.log(req.body);
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
            console.log(user);
            const newUser = new User();
            newUser.userId = req.body.user.sub;
            newUser.userName = req.body.user.given_name;
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
        }

    }).catch((error) => {
        console.log("Error - ", error);
    });


    console.log("Req Data - ", req.body);


    // User.findOne({userEmail: req.body.email});


}