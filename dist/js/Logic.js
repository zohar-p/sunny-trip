class Logic {
    constructor(){
        this.flights = []
        this.structuredCities = []
    }

    async getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration){
        fromCity = fromCity.toLowerCase()
        const flightsResponse = await apiManager.getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration)
        this.flights = flightsResponse
    }

    saveSearch(inputValues){
        return apiManager.saveSearch(inputValues)
    }

    getSavedSearches(){
        return apiManager.getSavedSearches()
    }

    deleteSavedSearch(DBID){
        apiManager.deleteSavedSearch(DBID)
    }

    fuseSameCity(){
        let fusedCities = []
        this.flights.forEach(f =>{
            if(this.flights.length){
                let destination = this.flights[0].toCity
                let allCityInstances = this.flights.filter(f => f.toCity == destination)
                this.flights = this.flights.filter(f => f.toCity != destination)
                fusedCities.push(allCityInstances)
            }
        })
        
        fusedCities.forEach(c => {
            this.structuredCities.push({
                toCity: c[0].toCity,
                weather: c[0].temp,
                conditionIcon: c[0].conditionIcon,
                conditionText: c[0].conditionText,
                flights: c.map(flight => { return {
                        away: flight.away,
                        return: flight.return,
                        price: flight.price,
                        flightDuration: flight.flightDuration,
                        fromCity: flight.fromCity,
                        toCity: flight.toCity,
                        fromDate: flight.fromDate,
                        toDate: flight.toDate,

                    }
                })

            })

        })
        console.log(this.structuredCities)

    }



}