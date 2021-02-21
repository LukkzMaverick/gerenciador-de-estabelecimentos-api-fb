const bcrypt = require('bcrypt');

const criptografarSenha = async (senha) => {
    const salt = await bcrypt.genSalt()
    senha = await bcrypt.hash(senha, salt)
    return senha
}

module.exports = criptografarSenha