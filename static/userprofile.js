const tel = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvC5jImv7gZA5QP1QYT7Y9O_TBn3hjeieJRw&usqp=CAU" style="width:5%;height:10%" alt="...">';
const gen = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRphGYGPo2ADD0X0u9j7f2vHurWvwr8z-Bk0A&usqp=CAU" style="width:5%;height:10%" alt="...">';

const socket = io("/chat");

let username;
let room;
let userType;

function openForm() {
    $("#myForm").css("display", "block");
}

function start() {
    openForm();
    //Join chatroom
    socket.emit("join", {username, room, userType});
}
  
function closeForm() {
    $("#myForm").css("display", "none");
}

//Message from server
socket.on('message', message => {
    outputMessage(message);
    $('.chat-messages').scrollTop($('.chat-messages').height());
});

$(document).ready( () => {

    $.get('/user-details', details => {

        if ( details.user == "doctor" ) {

            userType = details.user;

            const { name, medicalId, roomId } = details.userFound;

            username = name;
            
            $('h3').append(name);
            $('#name').text(name);
            $('#medicalId').text(medicalId);
            $('#roomId').text(roomId);
            $('#room').val(details.user);

            closeForm();

            const patients = details.patients;
            
            for (entry in patients) {
                $('#room').append(`<option value='${patients[entry].room}'>${patients[entry].username}</option>`);
            };

            const rooms = $('#room').children().length;
            
            if (rooms > 1) {
                $('#dropdown').css('display', 'block');
            } else {
                $('#delete-text').before('<h5 id="nopatients">At present there are no patients online to chat with.</h5><br>')
            }

            socket.on('room', userTemp => {
                $('#room').append(`<option value='${userTemp.room}'>${userTemp.username}</option>`);
                $('#dropdown').css('display', 'block');
                $('#nopatients').remove();
            });

            $('#room').on('change', function() {
                
                room = $('#room').val();
                
                //Join chatroom
                socket.emit("join", {username, room, userType});
                
                openForm();
            });
            
            socket.on(name, data => {
                let message = "Welcome to your chat.";

                $('.chat-messages').append(`<div class="p-3 bg-dark message"><p class="p-3 bg-light text" style="margin-bottom: 0px;">${message}</p></div>`);
                $('.chat-messages').scrollTop($('.chat-messages').height());
            });

        } else if ( details.user == "patient" ) {

            userType = details.user;

            closeForm();

            const { id, name, dateOfBirth, phoneNumber, emailAddress, niNumber } = details.userFound;

            room = niNumber;
            username = name;

            $('h3').append(name);
            $('#name').text(name);
            $('#dateOfBirth').text(dateOfBirth.slice(0, 10));
            $('#phoneNumber').text(phoneNumber);
            $('#emailAddress').text(emailAddress);
            $('#niNumber').text(niNumber);
            $('#delete-account').attr('href', `/deletepatient/${id}`);
            
            socket.on(name, data => {
                let message = "Welcome to your chat.";

                if (data.userTemp.type == "patient") {
                    message = data.patient;
                }

                $('.chat-messages').append(`<div class="p-3 bg-dark message"><p class="p-3 bg-light text" style="margin-bottom: 0px;">${message}</p></div>`);
                $('.chat-messages').scrollTop($('.chat-messages').height());
            });
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

    $("#myForm").submit(function(e){
        e.preventDefault();

        const text = $("#msg").val();

        const message = {
            username: username,
            text: text
        };
        
        //Emit message to server
        socket.emit("chatMessage", message);

        $('#msg').val('');
        $('#msg').focus();
    });

});

function outputMessage(message) {
    $('.chat-messages').append(`<div class="p-3 bg-white message"><p class="meta">${message.username}<span> ${message.time}</span></p><p class="p-3 bg-light text-dark text">${message.text}</p></div>`);
}