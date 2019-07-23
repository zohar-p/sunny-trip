class Logic {

    getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration){
        return apiManager.getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration)
    }

}