const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({

    order: {
        type: Object
    },

    status: {
        type: String,
        enum: ["NEW", "PENDING", "SOLVED"]
    }

});


module.exports = mongoose.model("Issue", issueSchema);