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
        empty()
    } else {
        notEmpty()
    }
}

const validateInputs = () => {
    maxPrice < 1 ? renderer.renderEmptyInput(maxPrice, 'Max price must be at least 1') : null
    flightDuration < 1 ? renderer.renderEmptyInput(flightDuration, 'Max flight duration must be at least 1') : null
    if(toDate <= fromDate) {
        renderer.renderEmptyInput(fromDate)
        renderer.renderEmptyInput(toDate, 'Return date must be later than departure date')
    }
    if(toTemp <= fromTemp) {
        renderer.renderEmptyInput(fromTemp)
        renderer.renderEmptyInput(toTemp, 'Max temperature must be higher than min temperature')
    }
}

$('#search-btn').on('click', async function () { // does this have to be async?
    const emptyInputs = inputs.filter(i => i.val() == '')
    const renderEmptyInput = () => emptyInputs.forEach(i => renderer.renderEmptyInput(i))
    const preformSearch = async () => {
        let inputsValues = inputs.map(i => i = i.val())
        await logic.getSearchResults(...inputsValues)
        logic.flights.forEach(f => {
            
            f.avgAllTemps = f.temp.forEach(t => t.avgTemp)
        })
        renderer.renderSearchResults(logic.flights)
    }
    
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

$('#container-results').on('click', '.delete-saved-search-btn', function () {
    const relDBID = $(this).closest('.search').data('id')
    logic.deleteSavedSearch(relDBID)
});

$('#show-saved-searches-btn').on('click', async function () {
    const savedSearches = await logic.getSavedSearches()
    savedSearches.forEach(s => {
        s.fromDate = moment(s.fromDate).format('DD/MM/YYYY')
        s.toDate = moment(s.toDate).format('DD/MM/YYYY')
    })
    renderer.renderSavedSearches(savedSearches)
})

