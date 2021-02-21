require('dotenv').config()
const connectDB = require('./config/db');
const routes = require('./routes')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000;

connectDB()

routes(app)

app.listen(PORT, () => { console.log(`port ${PORT}`) })

module.exports =  {app}