const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;


const paymentSchema = new mongoose.Schema({

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

    paymentBy: {
        type: ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    paymentIn: {
        type: ObjectId,
        ref: "Order",
        required: true,
        unique: true
    },

    paymentTotal: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["CARD", "CASH", "COD", "UPI", "DEPT"],
        default: "UPI"
    }




});


module.exports = mongoose.model("Payment", paymentSchema);