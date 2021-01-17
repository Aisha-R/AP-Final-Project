const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'static')));

const fs = require('fs');

const header = fs.readFileSync('public/fragments/header.html', 'utf8');
const home = fs.readFileSync('public/home/home.html', 'utf8');
const adminSignUp = fs.readFileSync('public/signup/admin.html', 'utf8');
const doctorSignUp = fs.readFileSync('public/signup/doctor.html', 'utf8');
const patientSignUp = fs.readFileSync('public/signup/patient.html', 'utf8');
const gpSignUp = fs.readFileSync('public/signup/gp.html', 'utf8');
const adminProfile = fs.readFileSync('public/userprofile/adminprofile.html', 'utf8');
const doctorProfile = fs.readFileSync('public/userprofile/doctorprofile.html', 'utf8');
const patientProfile = fs.readFileSync('public/userprofile/patientprofile.html', 'utf8');
const appointment = fs.readFileSync('public/appointment/appointment.html', 'utf8');
const footer = fs.readFileSync('public/fragments/footer.html', 'utf8');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const credentials = require('./config/mySQLcredentials.js');

const options = {
    host: '127.0.0.1',
    port: 3306,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database
};

// remember to copy the 'config.template.json' file and input your own secret
const config = require('./config/config.json');

const sessionMiddleware = session({
    secret: config.sessionSecret,
    resave: false,
    store: new MySQLStore(options),
    saveUninitialized: true
});

app.use(sessionMiddleware);

io.use( (socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, userLeave, getPatients } = require('./utils/users.js');
const admin = 'admin';

const manager = io.of("/chat").on('connection', socket => {

    socket.on("join", ({room, username, userType}) => {
        
        const userTemp = userJoin(socket.id, username, room, userType);
        
        socket.join(room);

        const patient = "The doctor will be with you in a moment.";
    
        //Welcomes current user
        manager.to(room).emit(username, {userTemp, patient}); 

        socket.broadcast.emit('room', userTemp);

        //Actual messages
        socket.on('chatMessage', message => {
            const userTemp = getCurrentUser(socket.id);
            manager.to(room).emit("message", formatMessage(userTemp.username, message.text));
        });

        //Runs when client disconnects
        socket.on('disconnect', () => {
            const userTemp = userLeave(socket.id);
            
            if (room) {
                manager.to(room).emit(admin, `${userTemp.username} has left the chat`);
            }
        });
    });
});

// Set up express-rate-limiter

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const authLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 10 // limit each IP to 100 requests per windowMs
});

app.use('/signup', authLimiter);
app.use('/login', authLimiter);

// Add routes

const authRoute = require('./routes/auth.js');
app.use(authRoute);

const userRoute = require('./routes/user.js');
app.use(userRoute);

const appointmentRoute = require('./routes/appointment.js');
app.use(appointmentRoute);

// Set up Objection w/ knex

const { Model } = require('objection');
const KnexLibrary = require('knex');
const knexfile = require('./knexfile.js');

const knexConnection = KnexLibrary(knexfile.development);

Model.knex(knexConnection); 

// Set up routes

app.get('/', (req, res) => {
    return res.send(header + home + footer); 
});

app.get('/adminsignup', (req, res) => {
    if ( req.session.user == "admin" ) {
        return res.send(header + adminSignUp + footer); 
    } else {
        req.session.message = "Restricted access.";
        return res.redirect('/');
    }
});

app.get('/gpsignup', (req, res) => {
    if ( req.session.user == "admin" ) {
        return res.send(header + gpSignUp + footer); 
    } else {
        req.session.message = "Restricted access.";
        return res.redirect('/');
    }
});

app.get('/doctorsignup', (req, res) => {
    if ( req.session.user == "admin" ) {
        return res.send(header + doctorSignUp + footer); 
    } else {
        req.session.message = "Restricted access.";
        return res.redirect('/');
    }
});

app.get('/patientsignup', (req, res) => {
    return res.send(header + patientSignUp + footer); 
});

app.get('/userprofile', (req, res) => {
    if ( req.session.user == "admin" ) {
        return res.send(header + adminProfile + footer); 
    } else if ( req.session.user == "doctor" ) {
        return res.send(header + doctorProfile + footer); 
    } else if ( req.session.user == "patient" ) {
        return res.send(header + patientProfile + footer); 
    } else {
        return res.redirect('/');
    }
});

app.get('/appointment', (req, res) => {
    if ( req.session.user == "patient" ) {
        return res.send(header + appointment + footer); 
    } else {
        return res.redirect('/');
    }
});

const PORT = process.env.PORT ? process.env.PORT : 3000;

server.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log(`Server is running on ${PORT}`);
    }
});