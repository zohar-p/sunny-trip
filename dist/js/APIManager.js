class APIManager {

    getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration){
        dates = dates.split(' / ')
        const fromDate = dates[0]
        const toDate = dates[1]
        return this.useAjax('get', `/flights/${fromCity}/${fromDate}/${toDate}/${fromTemp}/${toTemp}?maxPrice=${maxPrice}&flightDuration=${flightDuration}`)
    }

    saveSearch(inputValues){
        this.useAjax('post', 'search', null, inputValues)
    }
    
    getSavedSearches(){
        return this.useAjax('get', '/search')
    }

    deleteSavedSearch(DBID){
        this.useAjax('delete', '/search/' + DBID)
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