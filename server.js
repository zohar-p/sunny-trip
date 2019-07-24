const express = require('express')
const app = express()
const api = require('./server/routes/api')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const data = require('./city-to-code.json')
const cityCode = require('./server/models/City-Code')
const path = require('path')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/sunnytrip', {useNewUrlParser: true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)


// Load all data to DB
// let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
// const loadAll = function () {
//     for (item of data) {
//         if(format.test(item.airportCode)){

//         }else{
//             new cityCode ( {city: item.city.replace("-"," ").toLowerCase(), airportCode: item.airportCode} ).save();
//         }
//     }
// }
//loadAll();

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('Server running on port ' + port))