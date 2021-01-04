$(document).ready( () => {

    $.get('/user-details', details => {

        if ( details.user == "admin" ) {
            const { gps } = details;
            const { doctors } = details;
            
            if ( gps.length > 0 ) {
                $('#gp-admin').append('<h4>Your GP surgeries:</h4>');
                $('thead').append(`<tr><th scope="col">Name</th><th scope="col">Phone Number</th><th scope="col">Address</th><th scope="col">Remove</th></tr>`);
        
                let id = {};
                for ( gp in gps ) {
                    $('#gps').append(`<tr><td>${gps[gp].name}</td><td>${gps[gp].phoneNumber}</td><td></td><td></td></tr>`);
                    
                    id[gp] = gps[gp].gpAddressId;
                    
                    const block = doctors[`gp${gps[gp].id}`];

                    if ( Object.keys(block).length > 0) {

                        $('#doctors').append(`<h5>Doctors at ${gps[gp].name}</h5>`);
                        $('#doctors').append(`<table class="table" id="${gps[gp].id}"><thead><tr><th scope="col">Medical ID</th><th scope="col">Name</th><th scope="col">Room ID</th><th scope="col">Remove</th></tr><thead><tbody></tbody></table>`);
                        
                        for ( doctor in block ) {
                            $(`#${gps[gp].id} > tbody`).append(`<tr><td>${block[doctor][2]}</td><td>${block[doctor][1]}</td><td>${block[doctor][3]}</td><td><a href="/deletedoctor/${block[doctor][4]}">Delete</a></td></tr>`);
                        }
                    }
                }
                //send post request
                $.post('/gp-address-id', id);
                //call get request
                $.get('/gp-addresses', data => {
                    
                    let order = ['number', 'flatName', 'streetName', 'borough', 'city', 'country', 'postcode'];

                    for ( address in data ) {
                        let gpAddress = data[address][0];
                        let input = "";
                        
                        for (field in order) {

                            if (gpAddress[order[field]] !== null) {
                                input += gpAddress[order[field]] + ", ";
                            }
                        }
                                                
                        let nth = parseInt(address) + 1;
                        
                        $(`#gps > tr:nth-child(${nth}) > td:eq(2)`).text(`${input.slice(0, -2)}`);                        

                    }
                }).fail(function(error) {

                    console.log(error);
            
                });

                const rows = $('#gps').children().length;
                for (gp in gps) {
                    
                    const temp = parseInt(gp) + 1;
                    $(`#gps > tr:nth-child(${temp}) > td:eq(3)`).append(`<a href="/deletegp/${gps[gp].id}">Delete</a>`);
                }
            } else {
                $('table').after('<p>You are not listed as admin for any GPs.</p>')
            }
            
        } else if ( details.user == "doctor" ) {

            const { name, medicalId, roomId } = details.userFound;
            
            $('h3').append(name);
            $('#name').text(name);
            $('#medicalId').text(medicalId);
            $('#roomId').text(roomId);
            $('#room').val(details.user);

        } else if ( details.user == "patient" ) {

            const { id, name, dateOfBirth, phoneNumber, emailAddress, niNumber } = details.userFound;

            $('h3').append(name);
            $('#name').text(name);
            $('#dateOfBirth').text(dateOfBirth.slice(0, 10));
            $('#phoneNumber').text(phoneNumber);
            $('#emailAddress').text(emailAddress);
            $('#niNumber').text(niNumber);
            $('#delete-account').attr('href', `/deletepatient/${id}`);
            $('#room').val(`${name}`);

        }

    }).fail(function(error) {

        console.log(error);

    });

    $.get('/patient-appointments', data => {

        if ( Object.keys(data).length > 0 ) {

            $('#appointments').append('<thead><tr><th scope="col">Appointment Type</th><th scope="col">Date & Time</th><th scope="col">Doctor</th><th scope="col">Room ID</th><th>Remove</th></tr></thead>');
            $('#appointments').append('<tbody id="add-appts"></tbody>');

            for ( entry in data) {
                $('#add-appts').append(`<tr><td>${data[entry][0]}</td><td>${data[entry][1]}</td><td>${data[entry][2]}</td><td>${data[entry][3]}</td><td><a href="/deleteappt/${data[entry][4]}">Delete</a></td></tr>`);
            }
        } else {
            $('#appointments').append('<p>You have no upcoming appointments.</p>');
        }
    
    }).fail(function(error) {
        console.log(error);
    });

    $.get('/doctor-appointments', data => {
    
        if ( Object.keys(data).length > 0 ) {

            $('#doctor-appointments').append('<thead><tr><th scope="col">Appointment Type</th><th scope="col">Date & Time</th><th scope="col">Patient</th></tr></thead>');
            $('#doctor-appointments').append('<tbody id="add-doctor-appts"></tbody>');

            for ( entry in data) {
                $('#add-doctor-appts').append(`<tr><td>${data[entry][0]}</td><td>${data[entry][1]}</td><td>${data[entry][2]}</td></tr>`);
            }
        } else {
            $('#appointments').append('<p>You have no upcoming appointments.</p>');
        }
    
    }).fail(function(error) {
        console.log(error);
    });

});