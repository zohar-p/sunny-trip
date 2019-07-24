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
        let noResults = `<div class="no-result">SORRY, NO RESULTS FOUND<div>`
        $("#container-results").empty();
        $("#container-results").append(noResults);
    }
    emptyContainerResults(){
        $("#container-results").empty();
    }

    notifySavedSearch(){
        // this.smoothscrollto('.nav-bar')
        $('.saved-msg').fadeIn(400);
        setTimeout(() => {
            $('.saved-msg').fadeOut(500);
        }, 3000);

    }
}
