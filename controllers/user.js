const Admin = require('../models/Admin.js');
const Doctor = require('../models/Doctor.js');
const Patient = require('../models/Patient.js');
const GpAddress = require('../models/GpAddress.js');
const Appointment = require('../models/Appointment.js');
const Gp = require('../models/Gp.js');

const moment = require('moment');

const { getPatients } = require('../utils/users.js');

exports.which_user = (req, res) => {
    return res.json({response: req.session.user});
}

exports.select_gp = async (req, res) => {
    
    try {
        
        let data = []; 
    
        if (req.session.user == "admin") {
            
            const temp = await Admin.query().select().where('email', req.session.username).withGraphFetched('gps');
            const gps = temp[0].gps;
            const allowed = ["id", "name"];
            for ( gp in gps ) {
                const filtered = filtering(allowed, gps[gp]);
                data.push(filtered);
            }
        } else {
            
            const gps = await Gp.query().select();
            const allowed = ["id", "name"];
            for ( gp in gps ) {
                const filtered = filtering(allowed, gps[gp]);
                data.push(filtered);
            }
            
        }

        return res.json(data);

    } catch (error) {
        
        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/');
    }
}

exports.get_user_details = async (req, res) => {

    const { user, username } = req.session;
    
    try {

        const knex = Appointment.knex();
        await knex.raw('DELETE FROM appointments WHERE date_time < now()');

        let userFound;
        let patients = [];

        if (user == 'doctor') {
            patients = getPatients('patient');
            userFound = await Doctor.query().select().where('medicalId', username).limit(1);
            const allowed = ["name", "medicalId", "roomId"];
            userFound = filtering(allowed, userFound[0]);

        } else if (user == 'patient') {

            userFound = await Patient.query().select().where('niNumber', username).limit(1);
            const allowed = ["id", "name", "dateOfBirth", "phoneNumber", "emailAddress", "niNumber"];
            userFound = filtering(allowed, userFound[0]);

        }
        
        return res.json({ user: user, userFound: userFound, patients: patients });

    } catch (error) {

        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/');
    }

}

exports.get_admin_details = async (req, res) => {

    const { user, username } = req.session;
    
    try {
        const knex = Appointment.knex();

        await knex.raw('DELETE FROM appointments WHERE date_time < now()');

        let userFound;
        let adminWithGps;

        const store = [];
        const doctorList = [];
            
        adminWithGps = await Admin.query().select().where('email', username).withGraphFetched('gps');
        const gps = adminWithGps[0].gps;
        const allowed = ["id", "name", "phoneNumber"];
        const permitted = ["id", "name", "medicalId", "gpId", "roomId"];

        for ( entry in gps ) {

            const filtered = filtering(allowed, gps[entry]);
                
            const address = await GpAddress.query().select().where('id', gps[entry].gpAddressId).limit(1);
                
            store[entry] = {...filtered, ...address};
                
            const gp = await Gp.query().select().where('id', gps[entry].id).withGraphFetched('doctors');
                
            for (number in gp) {

                const doctors = gp[number].doctors;
                    
                for (index in doctors) {
                       
                    const filtered = filtering(permitted, doctors[index]);
                    doctorList.push(filtered);
                }

            }
                
        }

        const userDetails = {
            user: user,
            userFound: userFound,
            gps: store,
            doctors: doctorList
        }
        
        return res.json(userDetails);

    } catch (error) {

        req.session.message = "Something went wrong. Try again later.";

        return res.redirect('/');
    }
}

exports.get_patient_appointments = async (req, res) => {

    try {

        const patient = await Patient.query().select().where('niNumber', req.session.username).limit(1);

            if ( patient.length > 0 ) {
                
            const appointments = await Appointment.query().select().where('patientId', patient[0].id);

            const appts = [];
                
            for ( let i = 0 ; i < appointments.length ; i++ ) {
                const date_time = appointments[i].dateTime;
                const doctor = await Doctor.query().select().where('id', appointments[i].doctorId).limit(1);
                                    
                const doctorFilter = ["name", "roomId"];
                const doctorTemp = filtering(doctorFilter, doctor[0]);

                const apptFilter = ["id", "type"];
                const apptTemp = filtering(apptFilter, appointments[i]);

                appts[i] = {...apptTemp, date: moment(date_time).format('lll'), ...doctorTemp};
            }
                
            return res.json(appts);

        }
    } catch (error) {
    
        req.session.message = "Something went wrong. Try again later."; 

        return res.redirect('/userprofile');
    }
}

exports.get_doctor_appointments = async (req, res) => {
    try {

        const doctor = await Doctor.query().select().where('medicalId', req.session.username).limit(1);

        if ( doctor.length > 0 ) {
        
            const appointments = await Appointment.query().select().where('doctorId', doctor[0].id);

            const appts = [];

            for ( let i = 0 ; i < appointments.length ; i++ ) {

                const date_time = appointments[i].dateTime;
                const patient = await Patient.query().select().where('id', appointments[i].patientId).limit(1);

                const apptFilter = ["type"];
                const apptTemp = filtering(apptFilter, appointments[i]);

                const patFilter = ["name"];
                const patTemp = filtering(patFilter, patient[0]);

                appts[i] = {...apptTemp, date: moment(date_time).format('lll'), ...patTemp};

            }

            return res.json(appts);
        }

    } catch (error) {
    
        req.session.message = "Something went wrong. Try again later.";
        
        return res.redirect('/userprofile');
    }
}

function filtering(allowed, slim) {
    const filtered = Object.keys(slim).filter(key => allowed.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = slim[key];
                        return obj;
                    }, {}
                    );
    return filtered;
};