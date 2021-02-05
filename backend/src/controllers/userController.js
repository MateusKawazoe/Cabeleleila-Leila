const user = require('../models/user')
const auth_token = require('../services/auth')
const md5 = require("md5")
const interface = require('../common/controllerInterface/index')

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
        }, user, 'Usuário', {
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

        var aux

        if (password) {
            aux = await update({
                $set: {
                    phone: phone
                }
            })
        } else {
            const token = await auth_token.generateToken({
                username,
                password
            })

            aux = await update({
                $set: {
                    password: md5(password + global.SALT_KEY),
                    token: token,
                    phone: phone
                }
            })
        }
        return res.json(aux)
    },

    async showAll(req, res) {
        const response = await interface.showAll(user)
        return res.json(response)
    },

    async delete(req, res) {
        const response = await interface.delete(user, 'Usuário', { username: req.body.username })
        return res.json(response)
    }
}

function update(data) {
    return interface.update(data, user, 'Usuário', {
        username: username
    })
}