module.exports = {
    async store(data, model, type, filter) {
        const userExists = await model.findOne(filter)
        const CPFExists = await model.findOne({
            CPF: data.CPF
        })

        if (userExists || CPFExists)
            return type + ' já cadastrado!'

        const sucess = await model.create(data)
        
        if (sucess)
            return type + ' criado com sucesso!'
        else
            return 'Algo deu errado, verifique os campos!'
    },

    async update(data, model, type, filter) {
        const sucess = await model.updateOne({
            filter
        }, data)

        if (sucess)
            return type + ' atualizado com sucesso!'
        else
            return 'Algo deu errado, verifique os campos!'
    },

    async showAll(model) {
        const sucess = await model.find()

        if(!sucess[0])
            return 'Algo deu errado, verifique se existem dados cadastrados'
        
        return (sucess)
            
    },

    async delete(model, type, filter) {
        const sucess = await model.findOne(filter)
        
        if (sucess) {
            await model.deleteOne(filter)

            return type + ' excluído com sucesso!'
        } else {
            return type + ' não existe!'
        }
    }
}