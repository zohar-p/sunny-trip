class Renderer{

    renderSearchResults(data){
        const source = $('#flights-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({data});
        $("#container-results").append(newHTML);
    }

    renderSavedSearches(data){
        const source = $('#savedSearch-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template(data);
        $("#container-results").append(newHTML);
    }

    renderEmptyInput(input){
        input.css("border", "red")
    }

}
// CHECK
// const render = new Renderer
// let a = [{
//     cityName: "Tel Aviv",
//     date: "01/01/2019",
//     price: 34,
//     flightDuration:4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// }]
// console.log(a)
// render.renderSearchResults(a)