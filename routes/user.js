const router = require('express').Router();

const Admin = require('../models/Admin.js');
const Doctor = require('../models/Doctor.js');
const Patient = require('../models/Patient.js');
const GpAddress = require('../models/GpAddress.js');
const Appointment = require('../models/Appointment.js');

const moment = require('moment');
const Gp = require('../models/Gp.js');

router.get('/select-gp', async (req, res) => {

    try {
        
        const gps = await Gp.query().select();

        let data = {};

        for ( gp in gps ) {
            data[`${gp}`] = [gps[gp].id, gps[gp].name];
        }

        return res.json(data);

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/');
    }
});

router.get('/user-details', async (req, res) => {

    const { user, username } = req.session;
    
    try {
        const knex = Appointment.knex();

        await knex.raw('DELETE FROM appointments WHERE date_time < now()');

        let userFound;
        let adminWithGps;
        let gpDoctor = {};

        if (user == 'admin') {
            userFound = await Admin.query().select().where('email', username).limit(1);
            adminWithGps = await Admin.query().select().where('email', username).withGraphFetched('gps');
            const gps = adminWithGps[0].gps;
            
            for ( entry in gps ) {

                const gp = await Gp.query().select().where('id', gps[entry].id).withGraphFetched('doctors');

                for (number in gp) {

                    const doctors = gp[number].doctors;
                    let doctorList = {};

                    for (index in doctors) {
                        
                        const doctor = [doctors[index].gpId, doctors[index].name, doctors[index].medicalId, doctors[index].roomId, doctors[index].id];
                        doctorList[`doctor${doctors[index].id}`] = doctor;
                    }

                    gpDoctor[`gp${gp[number].id}`] = doctorList;

                }
                
            }

        } else if (user == 'doctor') {
            userFound = await Doctor.query().select().where('medicalId', username).limit(1);
        } else if (user == 'patient') {
            userFound = await Patient.query().select().where('niNumber', username).limit(1);
        }

        let userDetails;
        
        if ( adminWithGps == undefined ) {
            userDetails = {
                user: user,
                userFound: userFound[0]
            }
        } else {
            userDetails = {
                user: user,
                userFound: userFound[0],
                gps: adminWithGps[0].gps,
                doctors: gpDoctor
            }
        }
        
        return res.json(userDetails);

    } catch (error) {

        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/');
    }
});

router.post('/gp-address-id', async (req, res) => {

    const ids = req.body;
    var gps = {};

    try {

        for ( id in ids ) {
            const gp = await GpAddress.query().select().where('id', ids[id]);
            gps[id] = gp;
        }
        
        router.get('/gp-addresses', (req, res) => {
            return res.json(gps);
        });
        
        return res.status(200);

    } catch (error) {

        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/userprofile');
    }
});

router.get('/patient-appointments', async (req, res) => {

    try {

        const patient = await Patient.query().select().where('niNumber', req.session.username).limit(1);

            if ( patient.length > 0 ) {
            
            const appointments = await Appointment.query().select().where('patientId', patient[0].id);

            let appts = {};

            for ( let i = 0 ; i < appointments.length ; i++ ) {
                const date_time = appointments[i].dateTime;
                const doctor = await Doctor.query().select().where('id', appointments[i].doctorId).limit(1);
                appts[`no${i+1}`] = [appointments[i].type, moment(date_time).format('lll'), doctor[0].name, doctor[0].roomId, appointments[i].id]
            }

            return res.json(appts);

        }
    } catch (error) {
    
        req.session.message = "Something went wrong. Try again later."; 

        return res.redirect('/userprofile');
    }
});

router.get('/doctor-appointments', async (req, res) => {
    try {

        const doctor = await Doctor.query().select().where('medicalId', req.session.username).limit(1);

        if ( doctor.length > 0 ) {
        
            const appointments = await Appointment.query().select().where('doctorId', doctor[0].id);

            let appts = {};

            for ( let i = 0 ; i < appointments.length ; i++ ) {

                const date_time = appointments[i].dateTime;
                const patient = await Patient.query().select().where('id', appointments[i].patientId).limit(1);

                appts[`no${i+1}`] = [appointments[i].type, moment(date_time).format('lll'), patient[0].name];
            }

            return res.json(appts);
        }

    } catch (error) {
    
        req.session.message = "Something went wrong. Try again later.";
        
        return res.redirect('/userprofile');
    }
});

module.exports = router;