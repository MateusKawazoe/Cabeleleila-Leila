const schema = require('../common/modelInterface/index')

module.exports = schema({
    id: {
        type: String,
        required: true
    },
    service: [],
    clerk: []
}, 'infrastructure')