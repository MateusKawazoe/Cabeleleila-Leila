const {
    Schema,
    model
} = require('mongoose')

module.exports = function createSchema(data, type) {
    let schema = new Schema(data, {
        timestamps: true
    })

    return model(type, schema)
}