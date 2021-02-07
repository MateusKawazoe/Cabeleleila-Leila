const schedule = require('../models/schedule')
const interface = require('../common/controllerInterface/index')

module.exports = {
    async store(req, res) {
        const {
            client,
            date,
            service,
            clerk
        } = req.body

        const response = await interface.store({
            client: client,
            date: new Date(date),
            service: service,
            clerk: clerk,
            status: 1
        }, schedule, {
            client: client,
            date: date
        })
        return res.json(response)
    },

    async update(req, res) {
        const {
            client,
            date,
            service,
            clerk,
            status,
            newData
        } = req.body

        var changeSchedule = (Math.abs(new Date(date) - new Date())) / (1000 * 60 * 60 * 24)

        if ((changeSchedule < 2 || status != 1) && client.admin != 1) {
            return res.json(401)
        }

        var aux = {
            client: client,
            date: date
        }

        if (newData.client) {
            aux.client = newData.client
        }else if (newData.date) {
            aux.date = newData.date
        }

        const response = await interface.update({
            client: aux.client,
            date: aux.date,
            service: service,
            clerk: clerk,
            status: status
        }, schedule, {
            client: client,
            date: date
        })
        return res.json(response)
    },

    async showAll(req, res) {
        const response = await interface.showAll(schedule)
        return res.json(response)
    },

    async showOne(req, res) {
        const response = await interface.showOne(schedule, {
            client: req.body.client,
            date: req.body.date
        })
        console.log(formatar(response.date))
        return res.json(response)
    },

    async delete(req, res) {
        const response = await interface.delete(schedule, {
            client: req.body.client,
            date: req.body.date
        })
        return res.json(response)
    }
}