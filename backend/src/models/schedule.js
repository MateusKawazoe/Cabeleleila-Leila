const schema = require('../common/modelInterface/index')

module.exports = schema({
    client: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    service: {
        type: Object,
        required: true
    },
    clerk: {
        type: Object,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, 'schedule')