module.exports = {

    isParamExist: function (paramName,paramValue){
       return paramValue === "" ? "" : `&${paramName}=${paramValue}`
    },

    convertHour: function(unixTime){
        const date = new Date(unixTime*1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        
        // Will display time in 10:30 format
        return hours + ':' + minutes.substr(-2);
    }


}

