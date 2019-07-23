class Logic {
    constructor(){
        flights = []
    }

    getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration){
        return apiManager.getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration)
    }

    saveSearch(inputValues){
        return apiManager.saveSearch(inputValues)
    }

    getSavedSearches(){
        return apiManager.getSavedSearches()
    }

}