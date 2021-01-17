const router = require('express').Router();

const AuthController = require('../controllers/auth.js');

router.post('/login', AuthController.login);

router.post('/signup', AuthController.sign_up);

router.post('/add-gp', AuthController.add_gp);

router.get('/deleteappt/:apptId', AuthController.delete_appointment);

router.get('/deletedoctor/:doctorId', AuthController.delete_doctor);

router.get('/deletegp/:gpId', AuthController.delete_gp);

router.get('/deletepatient/:patientId', AuthController.delete_patient);

router.get('/logged', AuthController.is_logged_in);

router.get('/logout', AuthController.logout);

router.get('/getMessage', AuthController.get_message);

module.exports = router;