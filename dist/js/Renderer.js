class Renderer {

    renderSearchResults(data) {
        console.log(data)
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

    renderInputPopUp(input, msg){
        const inputBox = input.closest('.input-box')
        inputBox.append(`<div class="input-popup">${msg}</div>`)
    }

    renderInputError(input, msg) {
        console.log(msg)
        input.addClass('input-error')
        if(msg === 'empty') {
            input.attr('placeholder', 'Field is empty')
        } else {
            console.log('ran')
            this.renderInputPopUp(input, msg)
        }
        // input.css("box-shadow", "inset 0 0 4px red")
        // input::placeholder.css("color", "red")

    }

    renderNoResults() {
        let noResults = `<div class="no-result">SORRY, NO RESULTS FOUND<div>`
        $("#container-results").append(noResults);
    }
}
// CHECK
// const render = new Renderer

// render.renderNoResults()

// let a = [{
//     toCity: "Tel Aviv",
//     fromDate: "01/01/2019",
//     toDate: "05/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     toCity: "Rome",
//     fromDate: "01/01/2019",
//     toDate: "05/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     toCity: "Paris",
//     fromDate: "01/01/2019",
//     toDate: "05/01/2019",
//     price: 34,
//     flightDuration: 4.6,
//     temp: 30,
//     condition: "cloudy",
//     conditionPic: "https://cdn1.iconfinder.com/data/icons/airplane-glyph/64/Airplane_Flight_Airport_Transportation-07-512.png"
// },
// {
//     toCity: "New York",
//     fromDate: "01/01/2019",
//     toDate: "05/01/2019",
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
