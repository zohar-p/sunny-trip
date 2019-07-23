class APIManager {

    getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration){
        return this.useAjax('get', `/flights/${fromCity}/${fromDate}/${toDate}/${fromTemp}/${toTemp}/${price}/${flightDuration}`)
    }

    useAjax(method, url, success = response=>response, data){
        return $.ajax({
            method,
            url,
            data,
            success,
            error: (xhr, text, err) => console.log(`
            ERROR on $.ajax call:
            XHR: xhr
            Text: text
            Error: err`)
        })
    }
    
}