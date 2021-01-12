$(document).ready( () => {
    $.get('/select-gp', data => {
        
        for (gp in data) {
            $('#gpId').append(`<option value='${data[gp].id}'>${data[gp].name}</option>`);
        }
    }).fail(function(error) {
        console.log(error);
    });
});