const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    CPF: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('user',userSchema)