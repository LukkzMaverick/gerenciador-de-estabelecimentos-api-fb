const { check } = require("express-validator")
const MESSAGES = require("../../objects/messages")

const validatorLogin = [
    check('email',MESSAGES.VALID_EMAIL).isEmail(),
    check('senha',MESSAGES.PASSWORD_TOO_SHORT).isLength({min: 6})
]

const validatorRegister = [
    check('nome',MESSAGES.NAME_REQUIRED).notEmpty(),
    check('nome',MESSAGES.NAME_MUST_BE_A_STRING).isString(),
    check('email',MESSAGES.VALID_EMAIL,).isEmail(),
    check('senha',MESSAGES.PASSWORD_TOO_SHORT).isLength({min: 6})
]

const validatorRegisterAdmin = [
    check('email',MESSAGES.VALID_EMAIL).isEmail(),
    check('nome',MESSAGES.NAME_REQUIRED).notEmpty()
]

module.exports = {validatorLogin, validatorRegister, validatorRegisterAdmin}