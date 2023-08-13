const mongoose = require('mongoose');


const viewSchema = new mongoose.Schema({

    totalWebsiteViews: {
        type: Number
    },

    totalProductViews: {
        type: Number
    }

});


module.exports = mongoose.model("View", viewSchema);