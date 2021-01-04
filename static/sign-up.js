$(document).ready( () => {
    $.get('/select-gp', data => {
        
        for (gp in data) {
            $('#gpId').append(`<option value='${data[gp][0]}'>${data[gp][1]}</option>`);
        }
    }).fail(function(error) {
        console.log(error);
    });
});