const express = require("express");
const router = express.Router();
const CityCode = require('../models/City-Code')
const request = require('request-promise-native');
const APIKEY = "";


router.get("/flights/:fromCity/:fromDate/:toDate/:fromTemp/:toTemp", async function (req, res) {
    const reqParams = {
        fromCity : req.params.fromCity.replace("-"," "),
        fromDate : req.params.fromDate,
        toDate : req.params.toDate,
        fromTemp : req.params.fromTemp,
        toTemp : req.params.toTemp,
        maxPrice : req.query.maxPrice,
        dur : req.query.dur
    }

    const cityCodes = await CityCode.find({city: reqParams.fromCity}, { airportCode : 1 });
    res.send(cityCodes);

    //const flightResult = await request(`https://api.skypicker.com/flights?flyFrom=${reqParams.fromCity}`);

})

module.exports = router;