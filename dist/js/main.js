const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

const fromCity = $('#from-city')
const fromDate = $('#from-date')
const toDate = $('#to-date')
const maxPrice = $('#max-price')
const flightDuration = $('#flight-duration')
const fromTemp = $('#from-temp')
const toTemp = $('#to-temp')
const inputs = [fromCity, fromDate, toDate, fromTemp, toTemp, maxPrice, flightDuration]

const checkEmptyInputs = (empty, notEmpty) => {
    const emptyInputs = inputs.filter(i => i.val() == false)

    if(emptyInputs.length){
        empty()
    } else {
        notEmpty()
    }
}

$('#search-btn').on('click', async function () { // does this have to be async?
    const emptyInputs = inputs.filter(i => i.val() == '')
    const renderEmptyInput = () => emptyInputs.forEach(i => renderer.renderEmptyInput(i))
    const preformSearch = async () => {
        const matchingFlights = await logic.getSearchResults(...inputs)
        renderer.renderSearchResults(matchingFlights)
    }

    
    checkEmptyInputs(renderEmptyInput, preformSearch)
});

$('#save-search-btn').on('click', function () {
    const saveSearch = () => {
        let inputsValues = {}
        inputs.forEach(i => {
            inputsValues[i] = i.val()
        })
        logic.saveSearch(inputsValues)
    }

    checkEmptyInputs(renderEmptyInput, saveSearch)
});

$('#container-results').on('click', '.delete-saved-search-btn', function () {
    const relDBID = $(this).closest('.search').data('id')
    logic.deleteSavedSearch(relDBID)
});

$('#show-saved-searches-btn').on('click', function () {
    logic.getSavedSearches()
})

