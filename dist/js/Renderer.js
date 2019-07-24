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

    renderInputPopUp(input, msg){
        const inputBox = input.closest('.input-box')
        inputBox.append(`<div class="input-popup">${msg}</div>`)
    }

    renderInputError(input, msg) {
        input.addClass('input-error')
        if(msg === 'empty') {
            input.attr('placeholder', 'Field is empty')
        } else {
            console.log('ran')
            this.renderInputPopUp(input, msg)
        }
        // input.css("box-shadow", "inset 0 0 4px red")
        // input::placeholder.css("color", "red")

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
