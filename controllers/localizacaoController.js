const Empresa = require("../models/Empresa")
const Localizacao = require("../models/Localizacao")
const deepEqual = require("../util/functions/deepEqual")
const MESSAGES = require("../util/objects/messages")


module.exports = {
    async index(req, res){
        try {
            const localizacoes = await Localizacao.find({})
            if(localizacoes.length > 0){
                return res.status(200).send(localizacoes)
            }else{
                return res.status(404).send({ errors: [{ msg: MESSAGES["404_LOCALIZACOES"] }] })
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
    async getLocalizacoesByEmpresa(req, res){
        try {
            const {empresaId} = req.params
            let empresa = await Empresa.findOne({_id : empresaId}).
            populate({path: 'localizacoes', select: 'name'})
            let arrLocalizacoes = []
            for (const emp of empresa.localizacoes) {
                let localizacao = await Localizacao.findById(emp._id)
                arrLocalizacoes.push(localizacao)
            }
            
            if(arrLocalizacoes){
                return res.status(200).json({localizacoes: arrLocalizacoes})
            }else{
                return res.status(404).send({msg: MESSAGES['404_LOCALIZACOES']})
            }
            
        } catch (error) {
            console.error(error.message)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
}