const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    confirmPassword:{
      type: String,
      required: true,
      minlength: 6
    },
    securityQuestions: [{
        question: {
          type: String,
          required: true
        },
        answer: {
          type: String
        }
      }],
    dateCreated: {
        type: Date,
        default: Date.now,
      },
    verificationCode: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('User', userSchema)

// users