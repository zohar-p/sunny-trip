class Renderer {

    renderSearchResults(data) {
        data.forEach(data=>data.condition = data.temp[0].condition.text);
        data.forEach(data=> data.temp = data.temp[0].avgTemp);
        data.forEach(data=>data.conditionPic = data.temp[0].condition.icon);
        const source = $('#flights-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data });
        $("#container-results").empty();
        $("#container-results").append(newHTML);
    }

    renderSavedSearches(data) {
        const source = $('#savedSearch-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data });
        $("#container-results").empty();
        $("#container-results").append(newHTML);
    }

    renderEmptyInput(input) {
        input.css("border", "red")
    }

    renderNoResults() {
        let noResults = `<div class="no-result">SORRY, NO RESULTS FOUND<div>`
        $("#container-results").append(noResults);
    }
}
// CHECK
const render = new Renderer

render.renderNoResults()

// let a = [{
//     cityName: "Tel Aviv",
//     date: "01/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     cityName: "Tel Aviv",
//     date: "01/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     cityName: "Tel Aviv",
//     date: "01/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     cityName: "Tel Aviv",
//     date: "01/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// }]
// console.log(a)
// render.renderSearchResults(a)

// // check saved
// let b = [{
//     id: 37465,
//     fromCity: "Haifa",
//     fromDate: "10/11/2019",
//     toDate: "20/11/2019",
//     price: 3000,
//     duration: 5.5,
//     fromTemp: 25,
//     toTemp: 30,


// }]

//     render.renderSavedSearches(b)
