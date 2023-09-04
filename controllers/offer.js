const pigcolor = require('pigcolor');
const Offer = require('../models/offer');

exports.createOfferCode = (req, res) => {
    pigcolor.box("CREATE: Offer Code");
    console.log("Offer - ", req.body);
    const newOffer = new Offer();
    newOffer.code = req.body.input1;
    newOffer.value = req.body.input2;
    newOffer.status = "ACTIVE";
    newOffer.save().then((offer, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            offer: offer
        })
    }).catch((err) => {
        return res.json({
            error: err
        })
    })
}


exports.getAllOfferCode = (req, res) => {
    pigcolor.box("GET ALL: Orders");
    Offer.find({}).then((offers, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (!offers) {
            return res.json({
                error: "No Offers"
            })
        }
        return res.json({
            offers: offers
        })
    }).catch((err) => {
        return res.json({
            error: err
        })
    })
}


exports.getOfferCodeValue = (req, res) => {
    pigcolor.box("Offer: Code Value");
    Offer.findOne({ code: req.params.code }).then((code, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            code: code
        })
    }).catch((error) => {
        return res.json({
            error: error
        })
    });
}


exports.changeStatusOffer = (req, res) => {
    pigcolor.box("Change: Offer Status");
    console.log("Offer Body - ", req.body);
    Offer.findOne({ _id: req.body.id })
        .then((offer, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            console.log("Error - ", offer);
            if (offer.status === "ACTIVE") {
                offer.status = "INACTIVE"
            } else {
                offer.status = "ACTIVE"
            }
            offer.save().then((newOffer, err) => {
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                return res.json({
                    offer: newOffer
                })
            }).catch((err) => {
                return res.json({
                    error: err
                })
            });
        }).catch((err) => {
            return res.json({
                error: err
            })
        });
}

exports.deleteOfferCode = (req, res) => {
    pigcolor.box("DELETE: Offer");
    console.log(req.body);
    Offer.findOneAndDelete({ _id: req.body.id })
        .then((offer, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                offer: offer
            })
        }).catch((err) => {
            return res.json({
                error: err
            })
        });
}