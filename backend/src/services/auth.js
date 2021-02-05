const jwt = require('jsonwebtoken')

exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, {
        expiresIn: '1d'
    })
}

exports.decodeToken = async (token) => {
    return await jwt.verify(token, global.SALT_KEY)
}

exports.authorize = function (req, res, next) {
    var token = req.body.token

    if (!token) {
        res.status(401).json({
            message: 'Acesso restrito!'
        })
    } else {
        jwt.verify(token, global.SALT_KEY, function (error) {
            if (error) {
                res.status(401).json({
                    message: 'Token inválido!'
                })
            } else {
                next()
            }
        })
    }
}