const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    alternativePNum: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    bvn: {
        type: String,
        required: true
    },
    dateOfBirth: { 
        type: Date,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('Borrow', borrowSchema);

