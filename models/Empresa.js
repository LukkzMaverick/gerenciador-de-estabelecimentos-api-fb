const mongoose = require("mongoose")
const EmpresaSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    localizacoes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'localizacao',
    }],
})

module.exports = mongoose.model('empresa', EmpresaSchema)