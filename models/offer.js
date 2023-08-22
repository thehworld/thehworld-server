const mongoose = require('mongoose');


const offerSchema = new mongoose.Schema({



    code: {
        type: String,
        required: true
    },

    value: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true
    }


});



module.exports = mongoose.model("Offer", offerSchema);