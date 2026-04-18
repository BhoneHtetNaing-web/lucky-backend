const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const adminAuth = require('../../middleware/admin.middleware');

// Protected all routes
router.use(adminAuth);

//
router.get('/stats', controller.getStats);
// Bookings
router.get('/bookings', controller.getBookings);
// BookingById
router.get('/bookings/:id', controller.getBookingById);
// Fix
router.put('/bookings/:id/cancel', controller.cancelBooking);
// Payments
router.get('/payments', controller.getPayments);
// 
router.put('/kbz/approve/:id', controller.approveKBZPayment);

module.exports = router;