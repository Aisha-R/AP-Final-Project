const router = require('express').Router();

const UsersController = require('../controllers/user.js');

router.get('/which-user', UsersController.which_user);

router.get('/select-gp', UsersController.select_gp);

router.get('/user-details', UsersController.get_user_details);

router.get('/admin-details', UsersController.get_admin_details);

router.get('/patient-appointments', UsersController.get_patient_appointments);

router.get('/doctor-appointments', UsersController.get_doctor_appointments);

module.exports = router;