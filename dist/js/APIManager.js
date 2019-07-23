class APIManager {

    getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, maxPrice, flightDuration){
        console.log(fromCity)
        return this.useAjax('get', `/flights/${fromCity}/${fromDate}/${toDate}/${fromTemp}/${toTemp}?maxPrice=${maxPrice}&flightDuration=${flightDuration}`)
    }

    saveSearch(inputValues){
        this.useAjax('post', 'search', null, inputValues)
    }
    
    getSavedSearches(){
        this.useAjax('get', '/search')
    }

    deleteSavedSearch(DBID){
        this.useAjax('delete/:' + DBID, '/search')
    }

    useAjax(method, url, success = response=>response, data){
        return $.ajax({
            method,
            url,
            data,
            success,
            error: (xhr, text, err) => console.log(`
            ERROR on $.ajax call:
            XHR: ${xhr}
            Text: ${text}
            Error: ${err}`)
        })
    }
    
}