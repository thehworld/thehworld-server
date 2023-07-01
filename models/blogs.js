const mongoose = require('mongoose');
const crypto = required('crypto');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;


const blogsSchema = new mongoose.Schema({

    blogsId: {
        type: String,
        uniqie: true
    },

    blogsCategory: {
        type: ObjectId,
        ref: "Category",
        required: true
    },

    productId: {
        type: ObjectId,
        ref: "Product",
        required: true
    },

    blogTitle: {
        type: String,
        required: true
    },

    blogSubTitle: {
        type: String,
        required: true
    },

    blogDescription: {
        type: String,
        required: true
    },

    blogImages: {
        type: [String],
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model("Blogs", blogsSchema);