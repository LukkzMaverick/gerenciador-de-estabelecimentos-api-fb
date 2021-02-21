const { check } = require("express-validator")
const MESSAGES = require("../../objects/messages")

const validatorCadastrarEstabelecimento = [
    check('nome',MESSAGES.NAME_REQUIRED).notEmpty(),
    check('endereco',MESSAGES.ENDERECO_REQUIRED).notEmpty(),
    check('localizacao',MESSAGES.LOCALIZACAO_REQUIRED).notEmpty(),
    check('empresaId',MESSAGES.ID_EMPRESA_REQUIRED).notEmpty()
]

const validatorAtualizarEstabelecimento = [
    check('nome',MESSAGES.NAME_REQUIRED).notEmpty(),
    check('endereco',MESSAGES.ENDERECO_REQUIRED).notEmpty(),
    check('nomeLocalizacao',MESSAGES.NAME_LOCALIZATION_REQUIRED).notEmpty(),
]

module.exports = {
    validatorCadastrarEstabelecimento,
    validatorAtualizarEstabelecimento
}