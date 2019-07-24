module.exports = {

    isParamExist: function (paramName,paramValue){
       return paramValue === "" ? "" : `&${paramName}=${paramValue}`
    }


}

