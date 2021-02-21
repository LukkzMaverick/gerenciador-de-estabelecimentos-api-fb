const MESSAGES = require('../util/objects/messages');
const { validationResult } = require('express-validator');
const Estabelecimento = require('../models/Estabelecimento');
const Empresa = require('../models/Empresa');

module.exports = {

    async create(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const {nome, tipo} = req.body
            const usuario = req.user.id
            const empresa = new Empresa({nome,usuario, tipo})
            if(empresa._id){
                await empresa.save()
                return res.status(201).send(empresa)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES.DATABASE_ERROR }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async index(req, res){
        try {
            const empresas = await Empresa.find({})
            if(empresas.length > 0){
                return res.status(200).send(empresas)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES['404_EMPRESAS'] }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async EmpresasWithEstabelecimentos(req, res){
        try {
            const empresas = await Empresa.find({ localizacoes: { $exists: true, $not: {$size: 0} } })
            if(empresas.length > 0){
                return res.status(200).send(empresas)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES['404_EMPRESAS'] }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async byLoggedUser(req,res){
        try {
            const usuario = req.user.id
            const empresas = await Empresa.find({usuario})
            if(empresas){
                return res.status(200).send(empresas)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES['404_EMPRESAS'] }] })
            }
        } catch (error) {
            
        }
    },
    async update(req, res){
        try {
            const {empresaId} = req.params
            const empresa = await Empresa.findByIdAndUpdate(empresaId, {$set: req.body}, {new: true})
            if(empresa){
                return res.status(200).send(empresa)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES['404_EMPRESA'] }] })
            }
        } catch (error) {
            
        }
    },
    async delete(req, res){
        try {
            const {empresaId} = req.params
            const empresa = await Empresa.findByIdAndDelete(empresaId)
            if(empresa){
                Estabelecimento.deleteMany({empresa: empresaId})
                return res.status(200).send(empresa)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES['404_EMPRESA'] }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }


}