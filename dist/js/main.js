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
    const inputs = [fromCity, fromDate, toDate, fromTemp, toTemp, price, flightDuration]

    const emptyInputs = inputs.filter(i => i.val() == '')

    if(emptyInputs.length ){
        const matchingFlights = await logic.getSearchResults(...inputs)
        renderer.renderSearchResults(matchingFlights)
    } else {
        emptyINputs.forEach(i => renderer.renderEmptyInput(i))
    }

});