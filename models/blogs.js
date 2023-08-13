const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;


const blogsSchema = new mongoose.Schema({

    blogsId: {
        type: String,
        uniqie: true
    },


    blogTitle: {
        type: String,
        required: true
    },

    blogSubTitle: {
        type: String,
        required: true
    },

    blogSubSections: {
        type: [Object]
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