const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const admin = require('../../middleware/admin.middleware');
const auth = require("../../middleware/auth");

// Protected all routes
router.use(admin);

// DASHBOARD
router.get("/dashboard", auth, admin, controller.dashboard);
//
router.get('/stats', auth, controller.getStats);
// Bookings
router.get('/bookings', controller.getBookings);
// APPROVE
router.post('/bookings/:id/approve', auth, controller.approveBooking);
// BookingById
router.get('/bookings/:id', controller.getBookingById);
// Fix BOOKING
router.put('/bookings/:id/cancel', controller.cancelBooking);
// Payments
router.get('/payments', auth, controller.getPayments);
// REJECT
router.post('/reject/:id', auth, controller.reject);
// APPROVE KBZPAY
router.put('/kbz/approve/:id', auth, controller.approveKBZPayment);

module.exports = router;