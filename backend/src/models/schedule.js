const schema = require('../common/modelInterface/index')

module.exports = schema.createSchema({
    client: {
        type: Object,
        required: true
    },
    day: {
        type: data,
        required: true
    },
    hour: {
        type: date,
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
}, 'schedule')