const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    }
    ,
    businessArea: { 
        type: String,
        required: true
    },
    employees: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    additionalInformation: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Company =  mongoose.model("company", UserSchema)
module.exports = Company;
