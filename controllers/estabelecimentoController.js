const MESSAGES = require('../util/objects/messages');
const { validationResult } = require('express-validator');
const Estabelecimento = require('../models/Estabelecimento');
const Localizacao = require('../models/Localizacao');
const capitalizeFirstLetter = require('../util/functions/capitalizeFirstLetter');
const { removerLocalizacaoDeEmpresa, adicionarLocalizacaoDeEmpresa } = require('../helper/Empresa');

module.exports = {
    async create(req, res) {
        try {
            const user = req.user
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            let { nome, localizacao, endereco, empresaId } = req.body
            const localizacaoBefore = await Localizacao.
                findOne({
                     nome: { $regex: new RegExp('^' + localizacao + '$', "i") }
                })
            let localizacaoInserted
            if (!localizacaoBefore) {
                localizacaoInserted = new Localizacao(
                    { nome: capitalizeFirstLetter(localizacao)})
                await localizacaoInserted.save()
            }

            localizacao = localizacaoBefore ?  localizacaoBefore : localizacaoInserted
            adicionarLocalizacaoDeEmpresa(empresaId, localizacao._id)
            const estabelecimento = new Estabelecimento(
                {
                    nome, usuario: user.id, empresa: empresaId, localizacao: localizacaoBefore ?
                        localizacaoBefore._id : localizacaoInserted._id, endereco
                })

            if (estabelecimento._id) {
                await estabelecimento.save().then(t => t.populate
                    ({ path: 'localizacao', select: 'nome' }).execPopulate())
                res.status(201).send(estabelecimento)
            } else {
                return res.status(500).send({ errors: [{ msg: MESSAGES.DATABASE_ERROR }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async update(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const {estabelecimentoId, empresaId} = req.params

            let { nome, localizacaoId, nomeLocalizacao, endereco } = req.body
            let localizacao
            let estabelecimento
            if (localizacaoId && nomeLocalizacao) {
                const nomeLocalizacaoAlreadyExists = await Localizacao.
                findOne({
                     nome: { $regex: new RegExp('^' + nomeLocalizacao + '$', "i") }
                })
                if (!nomeLocalizacaoAlreadyExists) {
                    const localizacaoBefore = await Localizacao.
                    findOne({
                         nome: { $regex: new RegExp('^' + nomeLocalizacao + '$', "i") }
                    })
                    if(!localizacaoBefore){
                        localizacao = await new Localizacao
                        ({ nome: nomeLocalizacao})
                        await localizacao.save()
                        if(localizacao._id){
                            let localizacaoIdAntiga = localizacaoId
                            localizacaoId = localizacao._id
                            let estabelecimentos = await Estabelecimento.find(
                                { localizacao: localizacaoIdAntiga })
                            removerLocalizacaoDeEmpresa(empresaId, localizacaoIdAntiga)
                            adicionarLocalizacaoDeEmpresa(empresaId, localizacaoId)
                            if(estabelecimentos.length <= 1){
                                await Localizacao.findByIdAndDelete(localizacaoIdAntiga)
                            }
                        }
                    }
                }else{
                    let localizacao = await Localizacao.findOne({nome: nomeLocalizacao})
                    localizacaoId = localizacao._id
                    let est = await Estabelecimento.findOneAndUpdate({_id: estabelecimentoId}, {$set: {localizacao: localizacao._id}})
                    removerLocalizacaoDeEmpresa(empresaId, est.localizacao._id)
                    adicionarLocalizacaoDeEmpresa(empresaId, localizacao._id)
                    let estabelecimentos = await Estabelecimento.find(
                        { localizacao: est.localizacao._id })
                    if(estabelecimentos.length <= 1){
                        await Localizacao.findByIdAndDelete(est.localizacao._id)
                    }
                }
            }
            const update = { nome, localizacaoId, endereco }
            if (nome) {
                estabelecimento = await Estabelecimento.findByIdAndUpdate
                    (estabelecimentoId, update, { new: true })
                estabelecimento.localizacao = localizacaoId
                await estabelecimento.save().then(t => t.populate
                    ({ path: 'localizacao', select: 'nome' }).execPopulate())
            }
            if (estabelecimento) {
                return res.status(200).send(estabelecimento)
            } else if (localizacao) {
                if(!estabelecimento){
                    estabelecimento = await Estabelecimento.findById(estabelecimentoId)
                    .populate({ path: 'localizacao', select: 'nome' })
                }
                if (estabelecimento) {
                    return res.status(200).send(estabelecimento)
                }
            }
            return res.status(404).send({
                errors: [
                    { msg: MESSAGES['404_ESTABELECIMENTO'], param: '_id' }]
            })

        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async getByLocalizacaoAndEmpresa(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            let { localizacaoId, empresaId } = req.params

            let estabelecimentos = await Estabelecimento.find({
                $and: [
                    { empresa: empresaId },
                    { localizacao: localizacaoId }
                ]
            }).populate({ path: 'localizacao', select: 'nome' })
            .populate({path: 'empresa', select: 'nome'})

            if (estabelecimentos.length > 0) {
                return res.status(200).send(estabelecimentos)
            } else {
                return res.status(404).send({
                    errors: [
                        { msg: MESSAGES.ESTABELECIMENTO_EMPTY_LIST }]
                })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async getByEmpresa(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const {empresaId} = req.params

            let estabelecimentos = await Estabelecimento.find({ empresa: empresaId })
            .populate({ path: 'localizacao', select: 'nome' })

            if (estabelecimentos.length > 0) {
                return res.status(200).send(estabelecimentos)
            } else {
                return res.status(404).send({
                    errors: [
                        { msg: MESSAGES.ESTABELECIMENTO_EMPTY_LIST }]
                })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async getByLoggedUser(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const userId = req.user.id

            let estabelecimentos = await Estabelecimento.find({ usuario: userId })
            .populate({ path: 'localizacao', select: 'nome' })
            .populate({ path: 'empresa', select: 'nome' })

            if (estabelecimentos.length > 0) {
                return res.status(200).send(estabelecimentos)
            } else {
                return res.status(404).send({
                    errors: [
                        { msg: MESSAGES.ESTABELECIMENTO_EMPTY_LIST }]
                })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async getOne(req, res){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const estabelecimentoId = req.params.estabelecimentoId
            let estabelecimento = await Estabelecimento.findOne({ _id: estabelecimentoId })
            .populate({ path: 'localizacao', select: 'nome' })
            
            if (estabelecimento) {
                return res.status(200).send(estabelecimento)
            } else {
                return res.status(404).send({
                    errors: [
                        { msg: MESSAGES['404_ESTABELECIMENTO'] }]
                })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async delete(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const id = req.params.estabelecimentoId
            const estabelecimentoDeletado = await Estabelecimento.findByIdAndDelete(id)
            let estabelecimentos = true
            if(estabelecimentoDeletado){
                estabelecimentos = await Estabelecimento.find(
                    { localizacao: estabelecimentoDeletado.localizacao })
                removerLocalizacaoDeEmpresa(estabelecimentoDeletado.empresa,
                     estabelecimentoDeletado.localizacao)
            }
            if(estabelecimentos.length === 0){
                await Localizacao.findByIdAndDelete(estabelecimentoDeletado.localizacao)
            }

            if (estabelecimentoDeletado) {
                return res.status(200).send(estabelecimentoDeletado)
            } else {
                return res.status(404)
                    .send({ msg: MESSAGES['404_ESTABELECIMENTO'], param: '_id' })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    
    async getByLocalizacao(req, res) {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            let { localizacaoId } = req.params
            let estabelecimentos = await Estabelecimento.find(
                    { localizacao: localizacaoId }
                ).populate({ path: 'localizacao', select: 'nome' })
                .populate({path: 'empresa', select: 'nome'})

            if (estabelecimentos.length > 0) {
                return res.status(200).send(estabelecimentos)
            } else {
                return res.status(404).send({
                    errors: [
                        { msg: MESSAGES.ESTABELECIMENTO_EMPTY_LIST }]
                })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async getAll(req, res){
        try {
            const estabelecimentos = await Estabelecimento.find({})
            if(estabelecimentos.length > 0){
                return res.status(200).send(estabelecimentos)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES.ESTABELECIMENTO_EMPTY_LIST }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }
}

