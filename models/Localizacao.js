const mongoose = require("mongoose")
const LocalizacaoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('localizacao', LocalizacaoSchema)