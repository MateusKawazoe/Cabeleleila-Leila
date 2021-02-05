const schema = require('../common/modelInterface/index')

module.exports = schema.createSchema({
    client: {
        type: Object,
        require: true
    },
    day: {
        type: data,
        require: true
    },
    hour: {
        type: date,
        require: true
    },
    service: {
        type: Object,
        require: true
    },
    clerk: {
        type: Object,
        require: true
    },
}, 'schedule')