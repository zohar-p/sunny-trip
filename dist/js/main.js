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

    if(Number(fromTemp.val()) > Number(toTemp.val())) {
        renderer.renderInputError(fromTemp, 'min')
        renderer.renderInputError(toTemp, 'max')
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

const displaySearchResults = () => {
    if(logic.flights == 'No results found') {
        renderer.renderNoResults()
    } else {
        calcAvgTemp()
        addWeatherConditions()
        logic.fuseSameCity()
        renderer.renderDestinations(logic.structuredCities)
    }
}

$('#search-btn').on('click', async function () {
    inputs.forEach(i => renderer.resetInputError(i))

    const preformSearch = async () => {
        renderer.emptyContainerResults()
        let inputsValues = inputs.map(i => i = i.val())
        renderer.renderLoading();

        await logic.getSearchResults(...inputsValues)

        displaySearchResults()
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
        renderer.notifySavedSearch()
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

$('#container-results').on('click', '.search-again-btn', async function () {
    const searchBox = $(this).closest('.search')

    const fromCity = searchBox.find('.from-city-value').text()
    const fromDate = searchBox.find('.from-date-value').text().split('/').join('-')
    const toDate = searchBox.find('.to-date-value').text().split('/').join('-')
    const dates = `${fromDate} / ${toDate}`
    const fromTemp = searchBox.find('.from-temp-value').text()
    const toTemp = searchBox.find('.to-temp-value').text()
    const maxPrice = searchBox.find('.max-price-value').text()
    const flightDuration = searchBox.find('.flight-duration-value').text()

    renderer.emptyContainerResults()
    renderer.renderLoading();

    await logic.getSearchResults(fromCity, dates, fromTemp, toTemp, maxPrice, flightDuration)
    displaySearchResults()
});

$('.search-input').on('focus', function () {
    renderer.resetInputError($(this))
});

$('#container-results').on('click', '.destination', function () {
    const destinationName = $(this).closest('.destination').find('.destination-city-name').text()
    const relDestinationInfo = logic.structuredCities.find(c => c.toCity == destinationName)
    renderer.renderDestinationFlights(relDestinationInfo)
});

$('#container-results').on('click', '#close-popup-btn', function () {
    $('#dest-info-popup').remove()
    renderer.removeBlur()
});
