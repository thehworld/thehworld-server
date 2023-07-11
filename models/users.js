const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;



const userSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: [true, "Id Required"]
    },


    userAuthCode: {
        type: String,
        required: [true, "Id Required"],
        unique: true
    },

    userName: {
        type: String,
        required: [true, "Id Required"],
        maxLength: 56,
        trim: true
    },


    userEmail: {
        type: String,
        required: [true, "Id Required"],
        unique: true
    },

    userPhone: {
        type: String,
        trim: true
    },

    userProfilePic: {
        type: String
    },

    userGoogleName: {
        type: String
    },

    userLocation: {
        type: { type: String },
        coordinates: [Number],
    },

    userOrders: {
        type: [String]
    },

    userCart: {
        type: ObjectId,
        ref: "Cart",
    },


    userVerificationCodeStatus: {
        type: String,
        enum: ["New", "Verifyed Phone", "Verifyed Email"],
        default: "New"
    },




}, { timestamps: true });



module.exports = mongoose.model("User", userSchema);