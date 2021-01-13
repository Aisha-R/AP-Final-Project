const router = require('express').Router();

const Admin = require('../models/Admin.js');
const Doctor = require('../models/Doctor.js');
const Patient = require('../models/Patient.js');
const PatientAddress = require('../models/PatientAddress.js');
const Appointment = require('../models/Appointment.js');
const Gp = require('../models/Gp.js');
const GpAddress = require('../models/GpAddress.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;

const nodemailer = require('nodemailer');
const credentials = require('../config/nodemailerCredentials.js');
var transporter = nodemailer.createTransport(credentials);

router.post('/login', async (req, res) => {
    
    const { username, password, user } = req.body;

        try {

            let userFound;
            let name;

            if (user == 'admin') {
                userFound = await Admin.query().select().where('email', username).limit(1);
                name = 'admin';
            } else if (user == 'doctor') {
                userFound = await Doctor.query().select().where('medicalId', username).limit(1);
                name = 'doctor';
            } else if (user == 'patient') {
                userFound = await Patient.query().select().where('niNumber', username).limit(1);
                name = userFound[0].name;
            }
            
            if ( userFound.length > 0 ) {

                const result = await bcrypt.compare(password, userFound[0].password);

                if (result) {

                    req.session.user = user;
                    req.session.username = username;
                    req.session.name = name;

                    return res.redirect(`/userprofile`);

                } else {

                    req.session.message = "Incorrect username/password.";

                    return res.redirect('/');
                }
                    
            } else {

                req.session.message = "User doesn't exist.";

                return res.redirect('/');
            }

        } catch (error) {

            req.session.message = "Something went wrong. Try again later.";

            return res.redirect('/');
        }
});

router.post('/signup', async (req, res) => {
   
    const { username, password, repeatPassword, user } = req.body;
    
    if (password.length < 8 || password != repeatPassword ) {

        req.session.message = "Passwords must match and be 8 characters or more.";
        
        return res.redirect(`/${user}signup`);
    } else {
        try {
            let userFound;
            if (user == 'admin') {
                userFound = await Admin.query().select().where('email', username).limit(1);
            } else if (user == 'doctor') {
                userFound = await Doctor.query().select().where('medicalId', username).limit(1);
            } else if (user == 'patient') {
                userFound = await Patient.query().select().where('niNumber', username).limit(1);
            }
            
            if ( userFound.length > 0 ) {

                req.session.message = "User already exists.";

                return res.redirect(`/${user}signup`);
            } else {
                
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                
                let registeredUser;

                if (user == 'admin') {

                    registeredUser = await Admin.query().insert({
                        email: username,
                        password: hashedPassword
                    });
                    
                    req.session.user = user;
                    req.session.username = username;
                    req.session.name = user;

                    const mailOptions = {

                        from: 'NHS GP',
                        to: username,
                        subject: 'Registration Confirmation',
                        text: 'Welcome to NHS GP!\n\nTo begin using our services login to the website with your email address & password.'

                    };
        
                } else if (user == 'doctor') {

                    const { name, gpId, roomId, emailAddress } = req.body;
                    
                    registeredUser = await Doctor.query().insert({
                        name: name,
                        medicalId: username,
                        password: hashedPassword,
                        emailAddress: emailAddress,
                        gpId: gpId,
                        roomId: roomId
                    });
                    
                    const mailOptions = {

                        from: 'NHS GP',
                        to: emailAddress,
                        subject: 'Registration Confirmation',
                        text: 'Welcome to NHS GP!\n\nTo begin using our services login to the website with your Medical ID & password.'

                    };

                    await transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                
                } else if (user == 'patient') {

                    const { name, dateOfBirth, emailAddress, phoneNumber, gpId } = req.body;
                    const { doorNumber, flatName, streetName, borough, postcode, city, country } = req.body;

                    const address = await PatientAddress.query().insert({
                        country: country,
                        city: city,
                        borough: borough,
                        postcode: postcode,
                        streetName: streetName,
                        flatName: flatName,
                        number: doorNumber
                    });

                    registeredUser = await Patient.query().insert({
                        name: name,
                        dateOfBirth: dateOfBirth,
                        niNumber: username,
                        password: hashedPassword,
                        emailAddress: emailAddress,
                        phoneNumber: phoneNumber,
                        patientAddressId: address.id,
                        gpId: gpId
                    });

                    req.session.user = user;
                    req.session.username = username;
                    req.session.name = registeredUser.name;

                    const mailOptions = {

                        from: 'nodemandatory@gmail.com',
                        to: emailAddress,
                        subject: 'Registration Confirmation',
                        text: 'Welcome to NHS GP!\n\nTo begin using our services login to the website with your National Insurance number & password.'

                    };

                    await transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            
                return res.redirect('/userprofile');
            }

        } catch (error) {

            req.session.message = "Something went wrong. Try again later.";

            return res.redirect('/');
        }
    }
});

router.post('/add-gp', async (req, res) => {
    const { name, phoneNumber, doorNumber, streetName, borough, postcode, city, country } = req.body;

    let flatName = req.body.flatName;

    if (flatName == "") {
        flatName = null;
    }

    try {
        const admin = await Admin.query().select().where('email', req.session.username).limit(1);

        const address = await GpAddress.query().insert({
            number: doorNumber,
            flatName: flatName,
            streetName: streetName,
            postcode: postcode,
            borough: borough,
            city: city,
            country: country
        });

        await Gp.query().insert({
            name: name,
            phoneNumber: phoneNumber,
            gpAddressId: address.id,
            adminId: admin[0].id
        });
        
        return res.redirect('/userprofile');

    } catch (error) {
    
        req.session.message = "Something went wrong. Try again later.";
    
        return res.redirect('/userprofile');
    }
});

router.get('/deleteappt/:apptId', async (req, res) => {
    
    try {

        await Appointment.query().deleteById(req.params.apptId);

        return res.redirect('/userprofile');

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/userprofile');
    }
});

router.get('/deletedoctor/:doctorId', async (req, res) => {
    try {

        await Appointment.query().delete().where('doctorId', req.params.doctorId);

        await Doctor.query().deleteById(req.params.doctorId);

        return res.redirect('/userprofile');

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/userprofile');
    }
});

router.get('/deletegp/:gpId', async (req, res) => {
    try {

        const gp = await Gp.query().select('gpAddressId').where('id', req.params.gpId).limit(1);

        await Gp.query().deleteById(req.params.gpId);

        await GpAddress.query().deleteById(gp[0].gpAddressId);

        return res.redirect('/userprofile');

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/userprofile');
    }
});

router.get('/deletepatient/:patientId', async (req, res) => {
    try {

        await Appointment.query().delete().where('patientId', req.params.patientId);

        const patient = await Patient.query().select('patientAddressId').where('id', req.params.patientId).limit(1);

        await Patient.query().deleteById(req.params.patientId);

        await PatientAddress.query().deleteById(patient[0].patientAddressId);
        
        req.session.destroy();
        req.session = null;

        return res.redirect('/');

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/userprofile');
    }
});

router.get('/logged', (req, res) => {
    if ( req.session.username != undefined ) {
        return res.json(true);
    } else {
        return res.json(false);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    req.session = null;
    return res.redirect('/');
});

router.get('/getMessage', (req, res) => {
    const message  = req.session.message;
    
    req.session.message = null;

    return res.status(200).json(message);
});

module.exports = router;