const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;


const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        unique: true
    },

    orderShipmentStatus: {
        type: ObjectId,
        ref: "Shipment"
    },

    orderPaymentStatus: {
        type: ObjectId,
        ref: "Payment"
    },

    orderIssueStatus: {
        type: String,
        required: true
    },

    orderSubTotal: {
        type: String,
        required: true
    },

    orderTotal: {
        type: String,
        required: true
    },

    orderisOffer: {
        type: String
    },

    orderBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }




}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);