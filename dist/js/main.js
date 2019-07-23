const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

$('#search').on('click', async function () {
    const fromCity = $('#fromCity')
    const fromDate = $('#fromDate')
    const toDate = $('#toDate')
    const fromTemp = $('#fromTemp')
    const toTemp = $('#toTemp')
    const price = $('#price')
    const flightDuration = $('#flightDuration')
    const matchingFlights = await logic.getSearchResults(fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration)
    renderer.renderSearchResults(matchingFlights)
});