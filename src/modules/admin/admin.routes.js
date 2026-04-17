const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const adminAuth = require('../../middleware/admin.middleware');

// Protected all routes
router.use(adminAuth);

// Bookings
router.get('/bookings', controller.getBookings);
router.get('/bookings/:id', controller.getBookingById);
router.push('/bookings/:id/cancel', controller.cancelBooking);

// Payments
router.get('/payments', controller.getPayments);
router.put('/kbzpay/:id/approve', controller.verifyKBZ);

module.exports = router;