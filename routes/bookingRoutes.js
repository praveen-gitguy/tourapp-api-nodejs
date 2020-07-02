const express = require('express');
const router = express.Router();

const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckOutSessions);

router.use(authController.restrictTo('admin', 'lead-guide'));

router.route('/')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;