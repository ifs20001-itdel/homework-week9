const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: (payload) => {
        return jwt.sign(payload, 'secretKey',{ expiresIn: '24h' })
    },
    verifyToken: (payload) => {
        return jwt.verify(payload, 'secretKey')
    }
}