const schema = require('../common/modelInterface/index')

module.exports = schema({
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
    },
    token: {
        type: String,
        required: true
    },
    admin: Number,
}, 'user')