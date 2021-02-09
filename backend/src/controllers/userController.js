const user = require('../models/user')
const auth_token = require('../services/auth')
const md5 = require("md5")
const interface = require('../common/controllerInterface/index')
const validarCPF = require('../common/validator')

module.exports = {
    async login(req, res) {
        const {
            username,
            password,
            token
        } = req.body

        const userExists = await interface.showOne(user, {
            username
        })

        if (userExists == 400) {
            return res.json(400)
        }

        if (userExists.token) {
            if (userExists.token == token) {
                return res.json(token)
            } else {
                if (userExists.password == md5(password + global.SALT_KEY)) {
                    var auxToken

                    if (token) {
                        auxToken = token
                    } else {
                        auxToken = await auth_token.generateToken({
                            username: userExists.username,
                            password: md5(userExists.password + global.SALT_KEY)
                        })
                    }

                    await interface.update({
                        $set: {
                            token: auxToken
                        }
                    }, user, {
                        username
                    })

                    const aux = await interface.showOne(user, {
                        username
                    })

                    return res.json(aux)
                } else {
                    return res.json(401)
                }
            }
        }
    },

    async store(req, res) {
        const {
            username,
            password,
            fullname,
            phone,
            CPF,
            admin
        } = req.body

        if (!validarCPF(CPF))
            return res.json(402)

        const CPFExists = await interface.showOne(user, {
            CPF: CPF
        })

        if (CPFExists != 400)
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