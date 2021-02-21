const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    nome:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true,
        select: false
    },
    role:{
        type: String,
        default: 'user'
    }
})

const Usuario = mongoose.model('usuario',UsuarioSchema)
module.exports = {Usuario}