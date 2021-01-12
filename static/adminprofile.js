$(document).ready( () => {

    $.get('/admin-details', details => {

        const { gps } = details;
        const { doctors } = details;
        
        if ( gps.length > 0 ) {
            $('#gp-admin').append('<h4>Your GP surgeries:</h4>');
            $('thead').append(`<tr><th scope="col">Name</th><th scope="col">Phone Number</th><th scope="col">Address</th><th scope="col">Remove</th></tr>`);
        
            const order = ['number', 'flatName', 'streetName', 'borough', 'city', 'country', 'postcode'];

            for ( gp in gps ) {

                const address = gps[gp][0];
                let input = "";

                for (field in order) {

                    if (address[order[field]] !== null) {
                        input += address[order[field]] + ", ";
                    }
                }

                $('#gps').append(`<tr><td>${gps[gp].name}</td><td>${gps[gp].phoneNumber}</td><td>${input.slice(0, -2)}</td><td><a href="/deletegp/${gps[gp].id}">Delete</a></td></tr>`);
                    
                $('#doctors').append(`<h5>Doctors at ${gps[gp].name}</h5>`);
                $('#doctors').append(`<table class="table" id="${gps[gp].id}"><thead><tr><th scope="col">Medical ID</th><th scope="col">Name</th><th scope="col">Room ID</th><th scope="col">Remove</th></tr><thead><tbody></tbody></table>`);
                    
                for ( entry in doctors ) {
                    if ( doctors[entry].gpId == gps[gp].id ) {
                            
                        $(`#${gps[gp].id} > tbody`).append(`<tr><td>${doctors[entry].medicalId}</td><td>${doctors[entry].name}</td><td>${doctors[entry].roomId}</td><td><a href="/deletedoctor/${doctors[entry].id}">Delete</a></td></tr>`);
                    
                    }
                }
                const rows = $(`#${gps[gp].id} > tbody`).children().length;
                
                if (rows < 1) {
                    $(`#${gps[gp].id}`).remove();
                    $(`#doctors > h5:eq(${gp})`).after('<p>There are no doctors listed at this GP.</p>');
                }
            }
        } else {
            $('table').after('<p>You are not listed as admin for any GPs.</p>');
            $('#removeLink').remove();
        }
            
    }).fail(function(error) {

        console.log(error);

    });
});