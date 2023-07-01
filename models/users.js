const mongoose = require('mongoose');
const crypto = required('crypto');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;



const userSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        maxLength: 56,
        trim: true
    },

    userEmail: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    userPhone: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },

    // Auth

    encry_password: {
        type: String
    },


    salt: String,


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
        required: true // Create an empty cart 
    },


    userVerificationCodeStatus: {
        type: String,
        enum: ["New", "Verifyed Phone", "Verifyed Email"],
        default: "New"
    },

    userVerificationCode: {
        tye: String,
        required: true
    }



}, { timestamps: true });


userSchema.virtual('password').set(function(password) {
    this._password = password
    this.salt = uuidv4()
    this.encry_password = this.securePassword(password)
}).get(function() {
    return this._password
})


userSchema.methods = {

    authenticate: function(purePassword) {
        return this.securePassword(purePassword) === this.encry_password
    },

    securePassword: function(purePassword) {
        if (!purePassword)
            return "";
        try {
            return crypto
                .createHmac('sha256', this.salt)
                .update(purePassword)
                .digest('hex')
        } catch (err) {
            return "";
        }

    }


}




module.exports = mongoose.model("User", userSchema);