const { check } = require("express-validator")
const MESSAGES = require("../../objects/messages")

const validatorCadastrarEmpresa = [
    check('nome',MESSAGES.NAME_REQUIRED).notEmpty(),
    check('tipo',MESSAGES.TIPO_REQUIRED).notEmpty()
]

module.exports = {
    validatorCadastrarEmpresa
}