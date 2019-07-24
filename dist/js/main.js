const logic = new Logic
const renderer = new Renderer
const apiManager = new APIManager

const fromCity = $('#from-city-input')
const dates = $('#dates-input')
const maxPrice = $('#max-price-input')
const flightDuration = $('#flight-duration-input')
const fromTemp = $('#from-temp-input')
const toTemp = $('#to-temp-input')
const inputs = [fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration]
$('#dates-input').daterangepicker({
    "locale": {
        "format": "DD-MM-YYYY",
        "separator": " / "
    },
    "autoApply": true,
    "startDate": moment().format('DD-MM-YYYY'),
    "endDate": moment().add(6, 'days').format('DD-MM-YYYY'),
    "minDate": moment().format('DD-MM-YYYY'),
    "maxDate": moment().add(6, 'days').format('DD-MM-YYYY'),
    "opens": "center"
}, function(start, end) {});
const checkEmptyInputs = (empty, notEmpty) => {
    const emptyInputs = inputs.filter(i => i.val() == false)
    if(emptyInputs.length){
        empty(emptyInputs)
    } else {
        notEmpty()
    }
}

const validateInputs = () => {
    console.log('validating')
    if(toDate <= fromDate) {
        renderer.renderInputError(fromDate)
        renderer.renderInputError(toDate, 'Return date must be later than departure date')
    }
    if(toTemp <= fromTemp) {
        renderer.renderInputError(fromTemp)
        renderer.renderInputError(toTemp, 'Max temperature must be higher than min temperature')
    }
}

const checkInputErrors = () => {
    console.log('checking')
}

$('#search-btn').on('click', async function () { // does this have to be async?
    const renderEmptyInput = emptyInputs => emptyInputs.forEach(i => renderer.renderInputError(i, `empty`))
    const preformSearch = async () => {
        let inputsValues = inputs.map(i => i = i.val())
        await logic.getSearchResults(...inputsValues)
        if(logic.flights == 'No results found') {
            renderer.renderNoResults()
        } else {
            renderer.renderSearchResults(logic.flights)
        }
    }

    checkInputErrors()
    
    checkEmptyInputs(renderEmptyInput, preformSearch)
});

$('#save-search-btn').on('click', function () {
    // const saveSearch = () => {
        let inputsValues = {}
        inputs.forEach(i => {
            inputsValues[i.data('name')] = i.val()
        })
        inputsValues.dates = inputsValues.dates.split(' / ')
        inputsValues.fromDate = inputsValues.dates[0]
        inputsValues.toDate = inputsValues.dates[1]
        delete inputsValues.dates
        logic.saveSearch(inputsValues)
    // }

    // checkEmptyInputs(renderEmptyInput, saveSearch)
});

$('#container-results').on('click', '.delete-saved-search-btn', async function () {
    const relDBID = $(this).closest('.search').data('id')
    await logic.deleteSavedSearch(relDBID)
    const savedSearches = await logic.getSavedSearches()
    savedSearches.forEach(s => {
        s.fromDate = moment(s.fromDate).format('DD/MM/YYYY')
        s.toDate = moment(s.toDate).format('DD/MM/YYYY')
    })
    renderer.renderSavedSearches(savedSearches)
});

$('#show-saved-searches-btn').on('click', async function () {
    const savedSearches = await logic.getSavedSearches()
    savedSearches.forEach(s => {
        s.fromDate = moment(s.fromDate).format('DD/MM/YYYY')
        s.toDate = moment(s.toDate).format('DD/MM/YYYY')
    })
    renderer.renderSavedSearches(savedSearches)
})

