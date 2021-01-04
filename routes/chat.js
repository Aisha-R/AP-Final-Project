const router = require('express').Router();

const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');

router.get('/chat-setup', async (req, res) => {

    let user;
    let name = "";

    try {

        if (req.session.user == 'patient') {

            const patient = await Patient.query().select().where('niNumber', req.session.username).limit(1);
            user = patient[0];
            name = req.query.id;
            
        } else if (req.session.user == 'doctor') {

            const doctor = await Doctor.query().select().where('medicalId', req.session.username).limit(1);
            user = doctor[0];
        }

        const result = {
            userType: req.session.user,
            user: user,
            name: name
        };

        return res.json(result);

    } catch (error) {

        req.session.message = "Something went wrong. Try again later.";
        
        return res.redirect('/userprofile');
    }
});

module.exports = router;