const infrastructure = require('../models/infrastructure')
const interface = require('../common/controllerInterface/index')
const {
    type
} = require('os')

module.exports = {
    async storeService(req, res) {
        const {
            service
        } = req.body

        if (!service.type || !service.price) {
            return res.json(402)
        }

        const serviceExists = await interface.showOne(infrastructure, {
            id: 'Infrastructure'
        })

        var exists = 0

        await serviceExists.service.forEach(element => {
            if (element.type == service.type)
                exists = 1
        })

        if (exists)
            return res.json(401)

        const response = await interface.updateArray({
            $push: {
                service: service
            }
        }, infrastructure, {
            id: 'Infrastructure',
        })

        return res.json(response)
    },

    async storeClerk(req, res) {
        const {
            clerk
        } = req.body

        if (!clerk)
            return res.json(402)

        const clerkExists = await interface.showOne(infrastructure, {
            id: 'Infrastructure'
        })

        var exists = 0

        await clerkExists.clerk.forEach(element => {
            if (element == clerk)
                exists = 1
        })

        if (exists) {
            return res.json(401)
        }

        const response = await interface.updateArray({
            $push: {
                clerk: clerk
            }
        }, infrastructure, {
            id: 'Infrastructure',
        })
        return res.json(response)
    },

    async updateService(req, res) {
        const {
            service
        } = req.body

        const response = await interface.update({
            'service.$.price': service.price
        }, infrastructure, {
            id: 'Infrastructure',
            'service.type': service.type
        })
        return res.json(response)
    },

    async showOne(req, res) {
        const response = await interface.showOne(infrastructure, {
            id: 'Infrastructure'
        })
        return res.json(response)
    },

    async deleteService(req, res) {
        const {
            service
        } = req.body

        const response = await interface.updateArray({
            $pull: { service: service }
        }, infrastructure, {
            id: 'Infrastructure',
            'service.type': service.type
        })
        return res.json(response)
    },

    async deleteClerk(req, res) {
        const {
            clerk
        } = req.body

        const response = await interface.updateArray({
            $pull: { clerk: clerk }
        }, infrastructure, {
            id: 'Infrastructure'
        })
        return res.json(response)
    }
}