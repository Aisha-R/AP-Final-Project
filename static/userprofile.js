const tel = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvC5jImv7gZA5QP1QYT7Y9O_TBn3hjeieJRw&usqp=CAU" style="width:5%;height:10%" alt="...">';
const gen = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRphGYGPo2ADD0X0u9j7f2vHurWvwr8z-Bk0A&usqp=CAU" style="width:5%;height:10%" alt="...">';

$(document).ready( () => {

    $.get('/user-details', details => {

        if ( details.user == "doctor" ) {

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
        
        if ( data.length > 0 ) {

            $('#appointments').append('<thead><tr><th scope="col">Appointment Type</th><th scope="col">Date & Time</th><th scope="col">Doctor</th><th scope="col">Room ID</th><th>Remove</th></tr></thead>');
            $('#appointments').append('<tbody id="add-appts"></tbody>');
            
            for ( entry in data) {
                let type = "";
                if (data[entry].type == "general") {
                    type = gen;
                } else {
                    type = tel;
                }
                $('#add-appts').append(`<tr><td>${type}</td><td>${data[entry].date}</td><td>${data[entry].name}</td><td>${data[entry].roomId}</td><td><a href="/deleteappt/${data[entry].id}">Delete</a></td></tr>`);
            }
        } else {
            $('#patient-appointments').append('<h6 style="margin-top:25px;text-indent:25px">You have no upcoming appointments.</h6>');
        }
    
    }).fail(function(error) {
        console.log(error);
    });

    $.get('/doctor-appointments', data => {
        
        if ( data.length > 0 ) {

            $('#doctor-appointments').append('<thead><tr><th scope="col">Appointment Type</th><th scope="col">Date & Time</th><th scope="col">Patient</th></tr></thead>');
            $('#doctor-appointments').append('<tbody id="add-doctor-appts"></tbody>');

            for ( entry in data) {
                let type = "";
                if (data[entry].type == "general") {
                    type = gen;
                } else {
                    type = tel;
                }
                $('#add-doctor-appts').append(`<tr><td>${type}</td><td>${data[entry].date}</td><td>${data[entry].name}</td></tr>`);
            }
        } else {
            $('#appointments').append('<h6 style="margin-top:25px;text-indent:25px">You have no upcoming appointments.</h6>');
        }
    
    }).fail(function(error) {
        console.log(error);
    });

});