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