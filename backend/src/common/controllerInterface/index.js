module.exports = {
    async store(data, model, filter) {
        const exists = await model.findOne(filter)

        if (exists)
            return 400

        const sucess = await model.create(data)

        if (sucess)
            return sucess
        else
            return 401
    },

    async update(data, model, filter) {
        const sucess = await model.findOne(filter)

        if (sucess) {
            await model.updateOne(filter, {
                $set: data
            })
            return data
        } else
            return 400
    },

    async updateArray(data, model, filter) {
        const sucess = await model.findOne(filter)

        if(sucess) {
            await model.updateOne(filter, data)
            return 200
        } else 
            return 400
    },

    async showAll(model, filter, order) {
        var sucess = await model.find()
        
        if(!filter) {
            if(order) {
                sucess = await model.find().sort(order)
                if (!sucess[0])
                     return 400 
                return (sucess)
            } else {
                sucess = await model.find()
                if (!sucess[0])
                     return 400 
                return (sucess)
            }
        }
        else {
            if(order) {
                sucess = await model.find(filter).sort(order)
                if (!sucess[0])
                     return 400 
                return (sucess)
            } else {
                sucess = await model.find(filter)
                if (!sucess[0])
                     return 400 
                return (sucess)
            }
        }
    },

    async showOne(model, filter) {
        const sucess = await model.findOne(filter)

        if (!sucess) {
            return 400
        }

        return sucess
    },

    async delete(model, filter) {
        const sucess = await model.findOne(filter)

        if (sucess) {
            await model.deleteOne(filter)

            return 200
        } else {
            return 400
        }
    }
}