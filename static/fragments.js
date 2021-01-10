$(document).ready(() => {
    const currentYear = new Date().getFullYear();
    $("#copyright").text("© " + currentYear + ", NHS GP. All Rights Reserved.");

    $.get('/logged', logged => {
        
        if (logged) {
            $('#afterme').after('<a href="/userprofile">User Profile</a>');
            $('#beforeme').before('<a href="" id="logout"></a>');
            $('#logout').html('Log Out');
            $('#logout').attr('href', '/logout');
        } else {
            $('#logout').html('');
            $('#logout').attr('', '');
        }

    }).fail(function(error) {
        console.log(error);
    });

    $.get('/which-user', data => {
        
        if ( data.response == "patient") {
            $('#afterme').after('<a href="/appointment">Book Appointment</a>');
        }

    }).fail(function(error) {
        console.log(error);
    });

    $.get('/getMessage', message => {

        if (message != null) { 

            $("#pinmessage").append(`<p style="color:red">${message}</p>`);
            
        }

    });
});