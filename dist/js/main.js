const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

const fromCity = $('#from-city')
const fromDate = $('#from-date')
const toDate = $('#to-date')
const fromTemp = $('#from-temp')
const toTemp = $('#to-temp')
const price = $('#price')
const flightDuration = $('#flight-duration')
const inputs = [fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration]

$('#search-btn').on('click', async function () {
    const emptyInputs = inputs.filter(i => i.val() == '')

    if(emptyInputs.length){
        emptyInputs.forEach(i => renderer.renderEmptyInput(i))
    } else {
        const matchingFlights = await logic.getSearchResults(...inputs)
        renderer.renderSearchResults(matchingFlights)
    }
});

$('#save-search-btn').on('click', function () {
    let inputsValues = {}
    inputs.forEach(i => {
        inputsValues[i] = i.val()
    })
    logic.saveSearch(inputsValues)
});

