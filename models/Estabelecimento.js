const mongoose = require("mongoose")
const EstabelecimentoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    empresa:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'empresa',
        required: true
    },
    endereco:{
        type: String,
        required: true
    },
    localizacao:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'localizacao',
        required: true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
})

module.exports = mongoose.model('estabelecimento', EstabelecimentoSchema)