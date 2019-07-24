const express = require("express");
const router = express.Router();
const moment = require("moment");
const request = require("request-promise-native");
const removeAccents = require("remove-accents");
const CityCode = require("../models/City-Code");
const Search = require("../models/Search");
const Utils = require("../utils/utils")
const WEATHER_API_KEY = "bea57b220ef44538b62171913191707";
//https://api.skypicker.com/flights?flyFrom=TLV&date_from=24/07/2019&date_to=24/07/2019&return_from=26/07/2019&return_to=26/07/2019&max_stopovers=0

router.get(
    "/flights/:fromCity/:fromDate/:toDate/:fromTemp/:toTemp",
    async function (req, res) {
        let cityCodesReq = [];
        let airportsResults = [];
        let weatherReq = [];
        let weatherResults = [];
        let countryDetailsReq =[]
        let countryDetailsResults =[]

        const reqParams = {
            fromCity: req.params.fromCity.replace("-", " ").toLowerCase(),
            fromDate: req.params.fromDate,
            toDate: req.params.toDate,
            fromTemp: req.params.fromTemp,
            toTemp: req.params.toTemp,
            maxPrice: req.query.maxPrice || "",
            dur: req.query.flightDuration || "",
            lang: req.query.lang || ""
        };

        reqParams.lang.toLowerCase();

        //Format the dates:
        reqParams.fromDate = moment(reqParams.fromDate, "DD-MM-YYYY").format("DD/MM/YYYY");
        reqParams.toDate = moment(reqParams.toDate, "DD-MM-YYYY").format("DD/MM/YYYY");
        const fromDateFormat = moment(reqParams.fromDate, "DD/MM/YYYY");
        const toDateFormat = moment(reqParams.toDate, "DD/MM/YYYY");


        try {
            const cityCodes = await CityCode.find(
                { city: reqParams.fromCity },
                { airportCode: 1 }
            );

            //const bs = await request('http://www.apixu.com/doc/conditions.json');

           


            //For each city code, push Flight request to array
            cityCodes.forEach(c =>
                cityCodesReq.push(
                    request(
                        `https://api.skypicker.com/flights?flyFrom=${c.airportCode}&date_from=${reqParams.fromDate}&date_to=${reqParams.fromDate}&return_from=${reqParams.toDate}&return_to=${reqParams.toDate}&max_stopovers=0${Utils.isParamExist('price_to', reqParams.maxPrice)}${Utils.isParamExist("max_fly_duration", reqParams.dur)}&partner=picky`
                    )
                )
            );

            //Error handle for promise all
            const cityCodesRes = await Promise.all(
                cityCodesReq.map(p => p.catch(e => e))
            );
            const cityValidCodesRes = cityCodesRes.filter(
                result => !(result instanceof Error)
            );

            //Set all the results to airportsResults
            cityValidCodesRes.forEach(r => {
                airportsResults.push(JSON.parse(r).data);
            });

            //Run over all the flights in airports
            let airportsCities = {};
            airportsResults.forEach(airtport => {
                //Run over all the cities in airport and sperate them by city name
                airtport.forEach(flight => {
                    //Replace the another language letters to english letters
                    flight.cityTo = removeAccents(flight.cityTo).toLowerCase();
                    if (flight.cityTo in airportsCities)
                        airportsCities[flight.cityTo].push(flight);
                    else {
                        airportsCities[flight.cityTo] = [];
                        airportsCities[flight.cityTo].push(flight);
                    }
                });
            });

            //For each city, push Weather request to array
            for (cityKey in airportsCities) {
                weatherReq.push(
                    request(
                        `http://api.apixu.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityKey}&days=10`
                    )
                );
            }

            //Error handle for promise all
            weatherResults = await Promise.all(
                weatherReq.map(p => p.catch(e => e))
            );
            const weatherValidResults = weatherResults.filter(
                result => !(result instanceof Error)
            );




            //Take only the cities with the valid weather
            let validWeather = weatherValidResults.filter(cityWeat => {
                cityWeat = JSON.parse(cityWeat);

                //Take the forecast of the specific dates
                const specificDates = cityWeat.forecast.forecastday.filter(dayWeat => {
                    if (moment(dayWeat.date, "YYYY-MM-DD").isSameOrAfter(fromDateFormat)
                        && moment(dayWeat.date, "YYYY-MM-DD").isSameOrBefore(toDateFormat))
                        return dayWeat
                })

                //Check if those dates are in the temp range
                const isTempValid = specificDates.every(
                    dayWeat => {
                        return (
                            dayWeat.day.avgtemp_c >= reqParams.fromTemp &&
                            dayWeat.day.avgtemp_c <= reqParams.toTemp
                        );
                    }
                );

                if (isTempValid) return cityWeat;
            });

            //Return don't have any valid temp
            if (validWeather.length === 0) return res.send("No results found");

            let validCitiesWeather = validWeather.map(weather => {
                weather = JSON.parse(weather);

                //Take the forecast of the specific dates
                const specificDates = weather.forecast.forecastday.filter(dayWeat => {
                    if (moment(dayWeat.date, "YYYY-MM-DD").isSameOrAfter(fromDateFormat)
                        && moment(dayWeat.date, "YYYY-MM-DD").isSameOrBefore(toDateFormat))
                        return dayWeat
                })

                const forecast = specificDates.map(f => {
                    return {
                        date: f.date,
                        avgTemp: f.day.avgtemp_c,
                        condition: f.day.condition
                    };
                });

                return { name: weather.location.name.toLowerCase(), forecast };
            });

            const countries = {};
            for (cityName in airportsCities) {
                const valid = validCitiesWeather.some(
                    validWeather => cityName.toLowerCase() === validWeather.name
                );
                if (!valid) 
                    delete airportsCities[cityName];
                else{

                    if (airportsCities[cityName][0].countryTo.name in countries)
                        continue
                    else 
                        countries[airportsCities[cityName][0].countryTo.name.toLowerCase()] = "Country";
                }
            }
            
            // for(country in countries){
            //     countryDetailsReq.push(request(`https://restcountries.eu/rest/v2/name/${country}`));
            //     console.log(country)
            // }
            
            // //Error handle for promise all
            // const countryRes = await Promise.all(
            //     countryDetailsReq.map(p => p.catch(e => e))
            // );
            // const countryValidRes = countryRes.filter(
            //     result => !(result instanceof Error)
            // );

            // //Set all the results to airportsResults
            // countryValidRes.forEach(r => {
            //     countryDetailsResults.push(JSON.parse(r));
            // });

            // //Get Flag
            // console.log(countryDetailsResults)
            // countryDetailsResults.forEach(c => {
            //     if(c.length > 1){
            //         //TODO
            //     }else{
            //         // c.forEach(minC => {
            //         //     if(minC.name ===)
            //         // })
            //     }
            // })

            let finalResults = [];
            for (cityName in airportsCities) {
                airportsCities[cityName].forEach(airport => {
                    let weather = {};

                    validCitiesWeather.forEach(cityWeather => {
                        if (cityWeather.name === cityName)
                            return (weather = cityWeather);
                    });

                    finalResults.push({
                        fromCity: airport.cityFrom,
                        toCity: airport.cityTo,
                        fromDate: reqParams.fromDate,
                        toDate: reqParams.toDate,
                        price: airport.price,
                        flightDuration: airport.fly_duration,
                        temp: weather.forecast,
                        away: {
                            airport: airport.route[0].flyFrom,
                            airLine: airport.route[0].airline,
                            flightNumber: airport.route[0].operating_flight_no,
                            aHour: Utils.convertHour(airport.route[0].aTime),
                            dHour: Utils.convertHour(airport.route[0].dTime)
                        },
                        return: {
                            airport: airport.route[1].flyFrom,
                            airLine: airport.route[1].airline,
                            flightNumber: airport.route[1].operating_flight_no,
                            aHour: Utils.convertHour(airport.route[1].aTime),
                            dHour: Utils.convertHour(airport.route[1].dTime)
                        }
                    });
                });
            }


            res.send(finalResults);
        } catch (e) {
            console.log("Error", e);
            return res.send(e);
        }
    }
);

router.get("/search", async (req, res) => {
    const allSavedSearches = await Search.find({});
    res.send(allSavedSearches);
});

router.post("/search", (req, res) => {
    const inputValues = req.body;
    // console.log(inputValues.fromDate)
    // console.log(moment(inputValues.fromDate, 'DD-MM-YYYY').format())
    inputValues.fromDate = moment(inputValues.fromDate, 'DD-MM-YYYY').format()
    inputValues.toDate = moment(inputValues.toDate, 'DD-MM-YYYY').format()
    // res.end()
    const newSearch = new Search(inputValues);
    newSearch.save();
    res.send(newSearch);
});

router.delete("/search/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const deletedDoc = await Search.findByIdAndDelete({ _id: id });
    res.send(deletedDoc);
});

module.exports = router;