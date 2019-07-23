const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

const fromCity = $('#from-city-input')
const fromDate = $('#from-date-input')
const toDate = $('#to-date-input')
const maxPrice = $('#max-price-input')
const flightDuration = $('#flight-duration-input')
const fromTemp = $('#from-temp-input')
const toTemp = $('#to-temp-input')
const inputs = [fromCity, fromDate, toDate, fromTemp, toTemp, maxPrice, flightDuration]

const checkEmptyInputs = (empty, notEmpty) => {
    const emptyInputs = inputs.filter(i => i.val() == false)

    if(emptyInputs.length){
        empty(emptyInputs)
    } else {
        notEmpty()
    }
}

const validateInputs = () => {
    maxPrice < 1 ? renderer.renderInputError(maxPrice, 'Max price must be at least 1') : null
    flightDuration < 1 ? renderer.renderInputError(flightDuration, 'Max flight duration must be at least 1') : null
    if(toDate <= fromDate) {
        renderer.renderInputError(fromDate)
        renderer.renderInputError(toDate, 'Return date must be later than departure date')
    }
    if(toTemp <= fromTemp) {
        renderer.renderInputError(fromTemp)
        renderer.renderInputError(toTemp, 'Max temperature must be higher than min temperature')
    }
}

$('#search-btn').on('click', async function () { // does this have to be async?
    const renderEmptyInput = emptyInputs => emptyInputs.forEach(i => renderer.renderInputError(i, `empty`))
    const preformSearch = async () => {
        let inputsValues = inputs.map(i => i = i.val())
        await logic.getSearchResults(...inputsValues)
        renderer.renderSearchResults(logic.flights)
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

