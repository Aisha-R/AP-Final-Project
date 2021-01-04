const router = require('express').Router();

const moment = require('moment');

const Appointment = require('../models/Appointment.js');
const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');
const Gp = require('../models/Gp.js');

router.get('/format-dates', (req, res) => {
    
    const current = moment().format('L');
    let dates = {}
    dates['0'] = current;
    for ( let i = 1 ; i < 7 ; i++ ) {
        dates[i] = moment().add(i, 'days').format("L");
    }
        
    return res.json(dates);
});

router.get('/appointment-details', async (req, res) => {

    const date = req.query.option;

    const dateFormat = date.slice(0, 4) + date.slice(7,10) + date.slice(4, 7);
    
    try {
        const patient = await Patient.query().select().where('niNumber', req.session.username).limit(1);

        const gp = await Gp.query().select().where('id', patient[0].gpId).withGraphFetched('doctors');

        const doctors = gp[0].doctors;
        
        const knex = Appointment.knex();

        await knex.raw('DELETE FROM appointments WHERE date_time < now()');
        
        let data = {};

        let priorSlots = {};
        

        const start = moment(dateFormat + "T08:00:00.000Z");
    
        const after = moment(start).isAfter(moment(), 'day');
        
        if (!after) {
            const diff = moment.utc(moment().diff(start)).format("HH:mm");
            const inMinutes = diff.slice(0, 2) * 60 + parseInt(diff.slice(3));
            const duration = Math.ceil(inMinutes / 20);
            for ( let i = 1 ; i <= duration ; i++ ) {
                priorSlots[`slot${i}`] = i;
            }
        }

        for ( entry in doctors ) {
            
            const alt = await knex.raw(`SELECT * FROM appointments WHERE DATE(date_time) = DATE("${dateFormat}") AND doctor_id = ${doctors[entry].id}`);
            
            let slots = {};

            for ( index in alt[0] ) {
                
                const appt = moment(alt[0][index].date_time);
                
                const result = moment.utc(appt.diff(start)).format("HH:mm");
        
                const minutes = result.slice(0, 2) * 60 + parseInt(result.slice(3));
                
                slots[`slot${index}`] = minutes / 20 + 1;
                
            }

            data[`doctor${entry}`] = {
                medicalId: doctors[entry].medicalId, 
                name: doctors[entry].name, 
                slots: slots,
                priorSlots: priorSlots
            };

        }
        
        return res.json(data);

    } catch (error) {
        req.session.message = "Something went wrong. Try again.";
        return res.redirect('/userprofile');
    }
});

router.post('/book-appointment', async (req, res) => {
    const { time_doctor, date } = req.body;
    
    try {
        const patient = await Patient.query().select().where('niNumber', req.session.username).limit(1);

        const timeId = time_doctor.slice(0, 2).trim();
        let type = 'general';

        if (timeId < 4 || timeId > 12 && timeId < 16 ) { //modify these if you add rows.
            type = 'telephone';
        }

        let time = '08:00 AM';

        const dateFormat = date.slice(6, 10) + '-' + date.slice(0,2) + '-' + date.slice(3, 5);
        
        for ( let i = 1 ; i < timeId ; i++ ) {
            time = moment(dateFormat + 'T' + time.slice(0, 5) + ':00+00:00').add('20', 'minutes').format('HH:mm');
        }

        const dateTime = dateFormat + ' ' + time.slice(0, 5);
        
        const doctor = await Doctor.query().select().where('medicalId', time_doctor.slice(2).trim()).limit(1);

        await Appointment.query().insert({
            type: type,
            dateTime: dateTime,
            patientId: patient[0].id,
            doctorId: doctor[0].id
        });
        
    } catch (error) {

        req.session.message = "Something went wrong. Try again.";

        return res.redirect('/userprofile');
    }

    return res.redirect('/userprofile');
});

module.exports = router;