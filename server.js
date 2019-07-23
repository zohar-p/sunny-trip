const express = require('express')
const app = express()
const api = require('./server/routes/api')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/', {useNewUrlParser: true}) // add DB name

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('Server running on port ' + port))