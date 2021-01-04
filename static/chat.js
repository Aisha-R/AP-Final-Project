//Get patient/room from URL
let { user } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io("/chat");

let username;
let patient;

//Message from server
socket.on('message', message => {
    outputMessage(message);

    $('.chat-messages').scrollTop($('.chat-messages').height());
});

socket.on('admin', message => {
    $('.chat-messages').append(`<div class="message"><p class="text">${message}</p></div>`);

    $('.chat-messages').scrollTop($('.chat-messages').height());
});

$(document).ready(() => {
    
    $.get('/chat-setup', data => {
        if ( data.userType == 'patient') {
            username = data.user.name;
            
            socket.emit("initialise", user);

            //Join chatroom
            socket.emit("join", {username, user});
        } else {
            username = data.user.name;
            
            $('#dropdown').append('<label for="room">Choose a patient:</label><select class="form-select" id="room" name="room"><option selected disabled hidden></option></select>');
            
            socket.on('room', user => {
                $('#room').append(`<option value='${user}'>${user}</option>`);
            });

            $('#room').change(function() {
                
                user = $('#room').val();

                //Join chatroom
                socket.emit("join", {username, user});
            });
        }
        username = data.user.name;
    });

    $("form").submit(function(e){
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
    $('.chat-messages').append(`<div class="p-3 bg-light message"><p class="meta">${message.username} <span>${message.time}</span></p><p class="p-3 bg-white text-dark text">${message.text}</p></div>`);
}
