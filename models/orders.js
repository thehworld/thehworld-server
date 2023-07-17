const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;


const orderSchema = new mongoose.Schema({

    orderId: { // Payment MerchantOrderId
        type: String,
        unique: true
    },

    orderForUser: {
        type: String,
        required: true
    },

    orderProduct: {
        type: Object,
        required: true
    },

    orderNotes: {
        type: String
    },

    orderIssueNotes: {
        type: String
    },

    orderStatus: {
        type: String,
        enum: ["NEW", "ACCEPTED", "DISPATCHED", "SHIPPED", "OUTFORDELIVERY", "DELIVERED"],
        default: "NEW"
    },

    orderIssueStatus: {
        type: String,
        enum: ["NO", "NEW", "PENDING", "SOLVED"],
        default: "NO"
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
        type: Object,
        required: true
    },

    orderUpdateWAPhone: {
        type: String
    },

    // Payment

    paymentId: {
        type: String,
        required: true,
        unique: true
    },

    paymentStatus: {
        type: String,
        enum: ["INIT", "SUCCESS", "ERROR", "ISSUE"],
        default: "INIT"
    },

    paymentToken: {
        type: String,
        required: true,
        unique: true
    },


    paymentTotal: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        default: "UPI"
    },

    paymentResponse: {
        type: Object
    },


    // Shipment

    shipmentId: {
        type: String,
        required: true,
        unique: true
    },

    shipmentPincode: {
        type: String,
        required: true
    },

    shipmentAddress: {
        type: String,
        required: true
    },

    shipmentCityTown: {
        type: String,
        required: true
    },

    shipmentState: {
        type: String,
        required: true
    },

    shipmentStatus: {
        type: String,
        enum: ["INIT", "SUCCESS", "ERROR", "ISSUE"],
        default: "INIT"
    },


    shipmentFromLocation: {
        type: { type: String },
        coordinates: [Number],
    },

    shipmentToLocation: {
        type: { type: String },
        coordinates: [Number],
    },

    shipmentToken: {
        type: String,
        required: true,
        unique: true
    }




}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);