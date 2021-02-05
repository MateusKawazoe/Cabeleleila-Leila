const schema = require('../common/modelInterface/index')

module.exports = schema.createSchema({
    service: {
        type: String,
        required: true
    },
    clerk: {
        type: String,
        required: true
    }
}, 'infrastructure')