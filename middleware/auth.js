const jwt = require('jsonwebtoken')
const MESSAGES = require('../util/objects/messages')

module.exports = function (request, response, next) {
    const token = request.header('x-auth-token')
    if(!token){
        return response.status(401).json({errors: [{msg: MESSAGES.WITHOUT_TOKEN}]})
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
            return response.status(401).json({errors: [{msg: MESSAGES.INVALID_TOKEN}]})
        }
        request.user = decoded.user
        next()
    })
}