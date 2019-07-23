const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

$('#search-btn').on('click', async function () {
    const fromCity = $('#from-city')
    const fromDate = $('#from-date')
    const toDate = $('#to-date')
    const fromTemp = $('#from-temp')
    const toTemp = $('#to-temp')
    const price = $('#price')
    const flightDuration = $('#flight-duration')
    const matchingFlights = await logic.getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration)
    renderer.renderSearchResults(matchingFlights)
});

$('#save-search-btn').on('click', function () {
    
});