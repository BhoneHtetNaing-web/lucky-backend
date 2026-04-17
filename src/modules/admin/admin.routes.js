const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const adminAuth = require('../../middleware/admin.middleware');

// Protected all routes
router.use(adminAuth);

// Bookings
router.get('/bookings', controller.getBookings);
// BookingById
router.get('/bookings/:id', controller.getBookingById);
// Fix
router.put('/bookings/:id/cancel', controller.cancelBooking);

// Payments
router.get('/payments', controller.getPayments);
router.put('/kbzpay/:id/approve', controller.verifyKBZ);

router.get('/stats', controller.getStats);

module.exports = router;