const express = require("express");
const router = express.Router();
const moment = require('moment');
const CityCode = require('../models/City-Code')
const request = require('request-promise-native');



router.get("/flights/:fromCity/:fromDate/:toDate/:fromTemp/:toTemp", async function (req, res) {
    let cityCodesReq = [];
    let flightResults = [];

    const reqParams = {
        fromCity : req.params.fromCity.replace("-"," "),
        fromDate : req.params.fromDate,
        toDate : req.params.toDate,
        fromTemp : req.params.fromTemp,
        toTemp : req.params.toTemp,
        maxPrice : req.query.maxPrice,
        dur : req.query.flightDuration
    }

    //Format the dates:
    reqParams.fromDate = moment(reqParams.fromDate,'DD-MM-YYYY').format('DD/MM/YYYY');
    reqParams.toDate = moment(reqParams.toDate,'DD-MM-YYYY').format('DD/MM/YYYY');

    try{
        const cityCodes = await CityCode.find({city: reqParams.fromCity}, { airportCode : 1 });

        //For each city code, push request to array
        cityCodes.forEach(c => cityCodesReq.push(request(
            `https://api.skypicker.com/flights?flyFrom=${c.airportCode}&date_from=${reqParams.fromDate}&date_to=${reqParams.toDate}&price_to=${reqParams.maxPrice}&max_fly_duration=${reqParams.dur}`
        ))) 

        const cityCodesRes = await Promise.all(cityCodesReq);

        //Set all the results to flightResults
        cityCodesRes.forEach(r => {
            flightResults.push(JSON.parse(r).data);
        })

        res.send(flightResults)
    }
    catch(e){
        console.log("hi4");
        return res.send(e)
    }
})

router.post('/search', (req, res) => {
    const inputValues = req.body.inputValues
    console.log(inputValues)
    res.end()
})

module.exports = router;