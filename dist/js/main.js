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

const checkEmptyInputs = (empty, notEmpty) => {
    const emptyInputs = inputs.filter(i => i.val() == '')

    if(emptyInputs.length){
        notEmpty()
    } else {
        empty()
    }
}

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

    const emptyInputs = inputs.filter(i => i.val() == '')

    if(emptyInputs.length){
    } else {
        let inputsValues = {}
        inputs.forEach(i => {
            inputsValues[i] = i.val()
        })
        logic.saveSearch(inputsValues)
    }

});

$('#container-results').on('click', '.delete-saved-search-btn', function () {
    const relDBID = $(this).closest('.search').data('id')
    logic.deleteSavedSearch(relDBID)
});

$('#show-saved-searches-btn').on('click', function () {
    logic.getSavedSearches()
})

