const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models/Usuario');
const MESSAGES = require('../util/objects/messages');
const criptografarSenha = require('../util/functions/criptografarSenha');
const { validationResult } = require('express-validator');
const generatePassword = require('../util/functions/generatePassword');

module.exports = {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let { email, senha, nome } = req.body
            if (await Usuario.findOne({ email: email })) {
                return res.status(409).send({ errors: [{ msg: MESSAGES.EMAIL_ALREADY_REGISTERED }] })
            }
            senha = await criptografarSenha(senha)
            const usuario = new Usuario({ email, senha, nome })
            if (usuario.id) {
                await usuario.save()
                const payload = {
                    user: {
                        id: usuario.id,
                        email: usuario.email,
                        nome: usuario.nome,
                        role: usuario.role
                    }
                }
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3 days' }, (error, token) => {
                    if (error) throw error
                    return res.status(201).send({ token, ...payload })
                })
            } else {
                return res.status(500).send({ errors: [{ msg: MESSAGES.DATABASE_ERROR }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async registerForAdmin(req, res) {

        try {
            const user = req.user
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let { email, senha, nome, role } = req.body
            if (user.role === 'superAdmin') {
                if (!role) {
                    role = 'admin'
                }
                senha = generatePassword()
            } else {
                res.status(403).send({ errors: [{ msg: MESSAGES.FORBIDDEN }] })
            }
            if (await Usuario.findOne({ email: email })) {
                return res.status(409).send({ errors: [{ msg: MESSAGES.EMAIL_ALREADY_REGISTERED }] })
            }
            let senhaCriptografada = await criptografarSenha(senha)
            const usuario = new Usuario({ email, senha: senhaCriptografada, nome, role })
            await usuario.save()
            if (usuario.id) {
                let usuarioResposta = {
                    nome: usuario.nome,
                    senha: senha,
                    id: usuario._id,
                    role: usuario.role,
                    email: usuario.email
                }
                return res.status(201).send(usuarioResposta)

            } else {
                return res.status(500).send({ errors: [{ msg: MESSAGES.DATABASE_ERROR }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let { email, senha } = req.body
            const usuario = await Usuario.findOne({ email }).select('_id email nome senha role')
            if (!usuario) {
                return res.status(404).json({ errors: [{ msg: MESSAGES.INCORRECT_EMAIL_OR_PASSWORD }] })
            }
            const isMatch = await bcrypt.compare(senha, usuario.senha)

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: MESSAGES.INCORRECT_EMAIL_OR_PASSWORD }] })
            }

            const payload = {
                user: {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,
                    role: usuario.role
                }
            }

            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3 days' }, (error, token) => {
                if (error) throw error
                res.json({ token, ...payload })
            })

        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    validateToken(req, res) {
        try {
            const { token } = req.params
            jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
                if (err) {
                    return res.status(401).send({ errors: [{ msg: MESSAGES.INVALID_TOKEN }] })
                }

                const usuario = await Usuario.findOne({ email })
                return res.status(200).send(usuario)

            })
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }
}