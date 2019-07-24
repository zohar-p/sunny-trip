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

// DATE PICKER

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

const checkInputErrors = () => {
    const requiredInputs = inputs.filter(i => i.data('required') == true)
    const notRequiredInputs = inputs.filter(i => i.data('required') == false)
    let isSearchValid = true

    notRequiredInputs.forEach(i => {
        if(i.val() <= 0 && i.val() != '') {
            renderer.renderInputError(i, `${i.val()} is an invalid value`)
            isSearchValid = false
        }
    })

    const emptyRequiredInputs = requiredInputs.filter(i => i.val() == '')
    if(emptyRequiredInputs.length){
        emptyRequiredInputs.forEach(i => renderer.renderInputError(i, 'This field is required'))
        isSearchValid = false
    }
    return isSearchValid
}

const calcAvgTemp = () => {
    logic.flights.forEach(f => {
        let sum = 0
        f.temp.forEach(t => sum += Number(t.avgTemp))
        const avgTemp = Math.round(sum / f.temp.length)
        f.avgTemp = avgTemp
    })
}

const addWeatherConditions = () => {
    logic.flights.forEach(f => {
        f.conditionIcon = f.temp[0].condition.icon
        f.conditionText = f.temp[0].condition.text
    })
}

$('#search-btn').on('click', async function () {
    const preformSearch = async () => {
        // renderer.emptyContainerResults()
        let inputsValues = inputs.map(i => i = i.val())
        renderer.renderLoading();
        await logic.getSearchResults(...inputsValues)
        if(logic.flights == 'No results found') {
            renderer.renderNoResults()
        } else {
            calcAvgTemp()
            addWeatherConditions()
            renderer.renderSearchResults(logic.flights)
        }
    }

    const isSearchValid = checkInputErrors()
    isSearchValid ? preformSearch() : null
});

$('#save-search-btn').on('click', function () {
    const isSearchValid = checkInputErrors()
    if(isSearchValid){
        let inputsValues = {}
        inputs.forEach(i => {
            inputsValues[i.data('name')] = i.val()
        })
        inputsValues.dates = inputsValues.dates.split(' / ')
        inputsValues.fromDate = inputsValues.dates[0]
        inputsValues.toDate = inputsValues.dates[1]
        delete inputsValues.dates
        logic.saveSearch(inputsValues)
    }
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

