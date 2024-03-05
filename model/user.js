const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true // Make sure email is required
    },
    password: {
        type: String,
        required: true
    },
    resetOTP: {
        type: String,
        default: null
    },
    resetTokenExpiration: {
        type: Date, // Date type for storing expiration time
        default: null
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
