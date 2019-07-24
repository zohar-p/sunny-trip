class Logic {
    constructor(){
        this.flights = []
    }

    async getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration){
        const flightsResponse = await apiManager.getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration)
        console.log(flightsResponse)
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

}