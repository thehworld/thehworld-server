const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
        required: true,
        maxLength: 62,
        trim: true
    },

    categoryDescription: {
        type: String,
        required: true
    }


}, { timestamps: true });


module.exports = mongoose.model("Category", categorySchema);