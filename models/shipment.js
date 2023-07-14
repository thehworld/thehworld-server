const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;

const shipmentSchema = new mongoose.Schema({

    shipmentId: {
        type: String,
        required: true,
        unique: true
    },

    shipmentStatus: {
        type: String,
        enum: ["INIT", "SUCCESS", "ERROR", "ISSUE"],
        default: "INIT"
    },

    shipmentFor: {
        type: ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    shipmentOrder: {
        type: ObjectId,
        ref: "Order",
        unique: true
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


module.exports = mongoose.model("Shipment", shipmentSchema);