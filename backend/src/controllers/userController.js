const user = require('../models/user')
const auth_token = require('../services/auth')
const md5 = require("md5")
const interface = require('../common/controllerInterface/index')
const validarCPF = require('../../../common/validator')

module.exports = {
    async store(req, res) {
        const {
            username,
            password,
            fullname,
            CPF,
            phone,
            birth,
            admin
        } = req.body

        if (!validarCPF(CPF))
            return res.json(402)

        const CPFExists = await interface.showOne(user, {
            CPF: CPF
        })

        if (CPFExists)
            return res.json(403)

        let adm = 0

        if (admin)
            adm = 1

        const token = await auth_token.generateToken({
            username,
            password
        })

        const response = await interface.store({
            username: username,
            password: md5(password + global.SALT_KEY),
            fullname: fullname,
            CPF: CPF,
            phone: phone,
            birth: birth,
            token: token,
            admin: adm
        }, user, {
            username: username
        })

        return res.json(response)
    },

    async update(req, res) {
        const {
            username,
            password,
            phone,
        } = req.body

        var response

        if (!password) {
            response = await update(username, {
                phone: phone
            })
        } else {
            const token = await auth_token.generateToken({
                username,
                password
            })

            response = await update(username, {
                password: md5(password + global.SALT_KEY),
                token: token,
                phone: phone
            })
        }

        return res.json(response)
    },

    async showAll(req, res) {
        const response = await interface.showAll(user)
        return res.json(response)
    },

    async showOne(req, res) {
        const response = await interface.showOne(user, {
            username: req.body.username
        })
        return res.json(response)
    },

    async delete(req, res) {
        const response = await interface.delete(user, {
            username: req.body.username
        })
        return res.json(response)
    }
}

function update(username, data) {
    const response = interface.update(data, user, {
        username: username
    })
    return response
}