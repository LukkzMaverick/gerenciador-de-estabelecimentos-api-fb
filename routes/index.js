const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

module.exports = app => {
    app.use(cors())
    app.use(express.json())
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());  
    app.use('/auth',require('./usuarioRoutes'))
    app.use('/estabelecimento',require('./estabelecimentoRoutes'))
    app.use('/empresa',require('./empresaRoutes'))
    app.use('/localizacao',require('./localizacaoRoutes'))
}