const Empresa = require('../models/Empresa')

async function removerLocalizacaoDeEmpresa(empresaId, localizacaoId){
    const empresa = await Empresa.findByIdAndUpdate(empresaId, 
        { $pull: { localizacoes: localizacaoId} }, {new: true} )
    return empresa
}

async function adicionarLocalizacaoDeEmpresa(empresaId, localizacaoId){
    const empresa = await Empresa.findByIdAndUpdate(empresaId, 
        { $addToSet: { localizacoes: localizacaoId} }, {new: true} )
    console.log(empresa)
    return empresa
}

module.exports = {
    adicionarLocalizacaoDeEmpresa,
    removerLocalizacaoDeEmpresa
}