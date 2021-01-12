let test = new Date().toISOString();

let date = test.slice(0,4) + test.slice(7, 10) + test.slice(4, 7);

function renderTable(doctors) {
    
    const rows = $('tbody').children().length;

    for ( index in doctors) {
        
        $('thead > tr').append(`<th scope="col">Dr ${doctors[index].name}</th>`);

        for ( let i = 0 ; i < rows ; i++ ) {
            $(`tbody > tr:eq(${i})`).append(`<td><input type='radio' name='time_doctor' value='${i+1} ${doctors[index].medicalId}' id='id${i+1}${doctors[index].medicalId}'></td>`);
        }

        const slots = doctors[index].slots;

        if ( Object.keys(slots).length != 0 ) {
            for ( entry in slots ) {
                $(`#id${slots[entry]}${doctors[index].medicalId}`).attr('disabled', true);
            }
        }

        const priorSlots = doctors[index].priorSlots;
        if ( Object.keys(priorSlots).length != 0 ) {
            for (entry in priorSlots) {
                $(`#id${priorSlots[entry]}${doctors[index].medicalId}`).attr('disabled', true);
            }
        }
        
    }
}

$(document).ready( () => {
    
    $.get('/format-dates', dates => {
        for (let i = 0 ; i < 7 ; i++ ) {
            $(`option:nth-child(${i+1})`).text(dates[i]);
            $(`option:nth-child(${i+1})`).val(dates[i]);
        }
        $('#hidden-date').val($('select').val());
    });

    $.get('/appointment-details', {option: date}, doctors => {
        console.log(doctors);
        renderTable(doctors);

    });
    
    $('select').on('change', function() {

        const current = $(this).val();
        $('#hidden-date').val(current);

        date = current.slice(6, 10) + '-' + current.slice(3, 5) + '-' + current.slice(0, 2);
    
        $.get('/appointment-details', {option: date}, doctors => {
            
            const rows = $('tbody > tr').children().length
            const titles = $('thead > tr').children().length;

            for ( let i = 1 ; i < titles ; i++ ) {
                $(`thead > tr > th:eq(${1})`).remove();
        
                for ( let y = 0 ; y < rows ; y++ ) {
                    $(`tbody > tr:eq(${y}) > td:eq(${0})`).remove();
                }
            } 

            renderTable(doctors);
        });
    });
    
});