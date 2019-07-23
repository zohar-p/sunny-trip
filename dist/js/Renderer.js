class Renderer{

    renderSearchResults(data){
        const source = $('flights-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template(data);
        $("#container-results").append(newHTML);
    }

    renderSavedSearches(data){
        const source = $('savedSearch-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template(data);
        $("#container-results").append(newHTML);
    }






}