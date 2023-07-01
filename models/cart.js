const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const cartSchema = new mongoose.Schema({

    cartId: {
        type: String,
        required: true,
        unique: true
    },

    cartProduct: {
        type: [Object], // {prodId: id1, qty: 2},{prodId: id2, qty: 1}
        required: true
    },

    cartSubTotal: {
        type: String,
        required: true
    },

    cartBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model("Cart", cartSchema);