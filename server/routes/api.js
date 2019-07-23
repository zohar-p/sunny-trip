const express = require("express");
const router = express.Router();
const moment = require('moment');
const CityCode = require('../models/City-Code')
const Search = require('../models/Search')
const request = require('request-promise-native');
const removeAccents = require('remove-accents')
const WEATHER_API_KEY = "bea57b220ef44538b62171913191707";



router.get("/flights/:fromCity/:fromDate/:toDate/:fromTemp/:toTemp", async function (req, res) {
    //TODO: the query need to be optional
    let cityCodesReq = [];
    let airportsResults = [];
    let weatherReq = [];
    let weatherResults = [];

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

        //For each city code, push Flight request to array
        cityCodes.forEach(c => cityCodesReq.push(request(
            `https://api.skypicker.com/flights?flyFrom=${c.airportCode}&date_from=${reqParams.fromDate}&date_to=${reqParams.toDate}&price_to=${reqParams.maxPrice}&max_fly_duration=${reqParams.dur}`
        ))) 

        const cityCodesRes = await Promise.all(cityCodesReq);

        //Set all the results to airportsResults
        cityCodesRes.forEach(r => {
            airportsResults.push(JSON.parse(r).data);
        })

        //Run over all the flights in airports
        let airportsCities = {};
        airportsResults.forEach(airtport => {
            //Run over all the cities in airport and sperate them by city name
            airtport.forEach(flight => {
                //Replace the another language letters to english letters
                flight.cityTo = removeAccents(flight.cityTo).toLowerCase();
                if(flight.cityTo in airportsCities)
                    airportsCities[flight.cityTo].push(flight);
                else{
                    airportsCities[flight.cityTo] = [];
                    airportsCities[flight.cityTo].push(flight);
                }
            })
        })

        
        //For each city, push Weather request to array
        for(cityKey in airportsCities){
            weatherReq.push(
              request(
                `http://api.apixu.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityKey}&days=10`)
          );
        }

        //Error handle for promise all
        weatherResults = await Promise.all(weatherReq.map(p => p.catch(e => e)));
        const weatherValidResults = weatherResults.filter(result => !(result instanceof Error));

        //Take only the cities with the valid weather
        let validWeather = weatherValidResults.filter(cityWeat => {
            cityWeat = JSON.parse(cityWeat);
            const isTempValid = (cityWeat.forecast.forecastday.every(dayWeat => {
                return dayWeat.day.avgtemp_c >= reqParams.fromTemp && 
                        dayWeat.day.avgtemp_c <= reqParams.toTemp
            }))

            if(isTempValid)
                return cityWeat
        });

        //console.log(validWeather)
        
        //console.log(airportsCities)

        if(validWeather.length === 0)
            return res.send("No results found")
        
        let validCitiesWeather = validWeather.map(weather => {

            weather = JSON.parse(weather);
            let forecast = weather.forecast.forecastday.map(f =>{
                return{
                    date: f.date,
                    avgTemp: f.day.avgtemp_c,
                    condition: f.day.condition
                }
            })

            return {name: weather.location.name.toLowerCase(), forecast};
        });


        for(cityName in airportsCities){
           const valid = validCitiesWeather.some(validWeather =>
                cityName.toLowerCase() === validWeather.name
            )
            if(!valid)
                delete airportsCities[cityName]
        }

        let finalResults = [];
        for(cityName in airportsCities){
            airportsCities[cityName].forEach(airport => {

                let weather = {};

                validCitiesWeather.forEach(cityWeather => {
                    //console.log(cityWeather.name)
                    if(cityWeather.name === cityName){
                        return weather = cityWeather;
                    }
                })

                finalResults.push({
                    fromCity: airport.cityFrom,
                    toCity: airport.cityTo,
                    fromDate: reqParams.fromDate,
                    toDate: reqParams.toDate,
                    price: airport.price,
                    flightDuration: airport.fly_duration,
                    temp: weather.forecast
                });

            })
        }
        
        res.send(finalResults)
    }
    catch(e){
        console.log("Error");
        return res.send(e)
    }
})

router.get('/search', async (req, res) => {
    const allSavedSearches = await Search.find({})
    res.send(allSavedSearches)
})

router.post('/search', (req, res) => {
    const inputValues = req.body
    const newSearch = new Search(inputValues)
    newSearch.save()
    res.send(newSearch)
})

router.delete('/search/:id', async (req, res) => {
    const id = req.params.id
    const deletedDoc = await Search.findByIdAndDelete({_id: id})
    res.send(deletedDoc)
})

module.exports = router;