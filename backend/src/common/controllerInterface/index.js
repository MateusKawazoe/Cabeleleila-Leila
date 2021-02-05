module.exports = {
    async store(data, model, type, filter) {
        const exists = await model.findOne(filter)

        if (exists)
            return status(406).json(type + ' já cadastrado!')

        const sucess = await model.create(data)

        if (sucess)
            return status(201).json(type + ' criado com sucesso!')
        else
            return status(406).json('Algo deu errado, verifique os campos!')
    },

    async update(data, model, type, filter) {
        const sucess = await model.updateOne({
            filter
        }, data)

        if (sucess)
            return status(201).json(type + ' atualizado com sucesso!')
        else
            return status(406).json('Algo deu errado, verifique os campos!')
    },

    async showAll(model) {
        const sucess = await model.find()

        if (sucess)
            return status(201).json(sucess)
        else
            return status(406).json('Algo deu errado, verifique se existem dados cadastrados')
    },

    async delete(model, type, filter) {
        const sucess = await model.findOne({
            filter
        })
    
        if(sucess) {
            await model.deleteOne({
                filter
            })

            return status(201).json(type + ' excluído com sucesso!')
        } else {
            return status(406).json(type + ' não existe!')
        }
    }
}