class Renderer {

    renderSearchResults(data) {
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

    renderDestinations(data) {
        const source = $('#destination-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data });
        $("#container-results").empty();
        $("#container-results").append(newHTML);
    }

    renderDestinationFlights(destination) {
        const source = $('#destination-info-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ data: destination.flights });
        $("#container-results").append(newHTML); 
        $(".result").css("filter", "blur(2px)");
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

    resetInputError(input){
        input.removeClass('input-error')
    }

    smoothScrollTo = function(scrollTo){
        $([document.documentElement, document.body]).animate({
            scrollTop: scrollTo.offset().top
        }, 1600);
    }
    
    renderLoading(){
        $("#container-results").empty()
            .css('height', '100vh');
        this.smoothScrollTo($("#container-results"))
        $("#container-results").append(`
            <div class="loader"></div>   
        `);
    }

    renderNoResults() {
        let noResults = `<div class="no-result result">SORRY, NO RESULTS FOUND<div>`
        $("#container-results").empty();
        $("#container-results").append(noResults);
    }
    emptyContainerResults(){
        $("#container-results").empty();
    }

    notifySavedSearch(){
        this.smoothScrollTo($('.nav-bar'))
        $('.saved-msg').fadeIn(400);
        setTimeout(() => {
            $('.saved-msg').fadeOut(500);
        }, 3000);

    }

    removeBlur(){
        $(".result").css("filter", "")
    }
}
