const router = require('express').Router();

const AppointmentsController = require('../controllers/appointment.js');

router.get('/format-dates', AppointmentsController.format_dates);

router.get('/appointment-details', AppointmentsController.appointment_details);

router.post('/book-appointment', AppointmentsController.book_appointment);

module.exports = router;