const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({


    productId: {
        type: String,
        required: true,
        unique: true
    },

    productName: {
        type: String,
        maxLength: 48,
        required: true
    },

    productCategory: {
        type: ObjectId,
        ref: "Category",
        required: true
    },

    productPrice: {
        type: String,
        // required: true
        default:0
    },

    productDiscountPrice: {
        type: String,
        required: true,
    },

    productDescription: {
        type: String,
        required: true
    },

    productIngredient: {
        type: [Object], // {"ingredient": ["","",""]}
        required: true
    },

    productDetails: {
        type: [Object], // {"quality":"", "certificate":""}
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    productImages: {
        type: [String], // productIamges[0] -> Main Product Image
        requied: true
    },

    howTo: {
        type: [Object],
        requied: true
    },

    benifitsSkinType: {
        type: [Object],
        requied: true
    },

    productReview: {
        type: [Object],
        requied: true
    }



}, { timestamps: true });



module.exports = mongoose.model("Product", productSchema);