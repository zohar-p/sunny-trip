class Renderer {

    renderSearchResults(data) {
        console.log(data)
        const source = $('#flights-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data });
        $("#container-results").empty();
        $("#container-results").append(newHTML);
    }

    renderSavedSearches(data) {
        const source = $('#savedSearch-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data });
        $("#container-results").empty();
        $("#container-results").append(newHTML);
    }

    renderInputError(input, msg) {
        input.addClass('input-error')
        if(msg === 'empty') {
            input.val('')
            input.attr('placeholder', 'Field is empty')
        } else {
            input.val('')
            input.attr('placeholder', msg)
        }
    }

    renderNoResults() {
        let noResults = `<div class="no-result">SORRY, NO RESULTS FOUND<div>`
        $("#container-results").empty();
        $("#container-results").append(noResults);
    }
    emptyContainerResults(){
        $("#container-results").empty();
    }
}
