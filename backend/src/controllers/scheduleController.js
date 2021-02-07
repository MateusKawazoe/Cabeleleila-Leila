const schedule = require('../models/schedule')
const interface = require('../common/controllerInterface/index')
const checkWeek = require('../common/checkweek/index')

module.exports = {
    async store(req, res) {
        const {
            client,
            date,
            service,
            clerk
        } = req.body

        if (!service)
            return res.json(401)
        else if (date < new Date())
            return res.json(402)

        const response = await interface.store({
            client: client,
            date: new Date(date),
            clerk: clerk,
            service: [],
            status: 1
        }, schedule, {
            client: client,
            date: date
        })

        if (response != 400) {
            const insertServices = await interface.updateArray({
                $push: {
                    service: {
                        $each: service
                    }
                }
            }, schedule, {
                client: client,
                date: date
            })

            return res.json(insertServices)
        } else
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
        } else if (newData.date) {
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
    },

    async sameWeek(req, res) {
        const {
            client,
            date
        } = req.body

        const sameWeek = await interface.showAll(schedule, {
            client: client,
            status: 1
        })

        if (sameWeek[0]) {
            for (const element of sameWeek) {
                if (await checkWeek(element.date, date)) {
                    return res.json({
                        client: element.client,
                        date: date,
                        code: 200
                    })
                }
            }
        }
        
        return res.json(400)
    }
}