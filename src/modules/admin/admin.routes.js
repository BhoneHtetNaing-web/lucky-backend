const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const admin = require('../../middleware/admin.middleware');
const auth = require("../../middleware/auth.middleware");

// Protected all routes
router.use(admin);

// DASHBOARD
router.get("/dashboard", auth, admin, controller.dashboard);
//
router.get('/stats', auth, async (req, res) => {
    res.json({
        users: 10,
        bookings: 5,
        payments: 3,
    });
});
// Bookings
router.get('/bookings', auth, async (req, res) => {
    // DB query here
    res.json([]);
});
// Payments
router.get('/payments', auth, async (req, res) => {
    res.json([]);
});
// Messages
router.get('/messages', auth, async (req, res) => {
    res.json([]);
});
// APPROVE
router.post('/bookings/:id/approve', auth, controller.approveBooking);
// BookingById
router.get('/bookings/:id', controller.getBookingById);
// Fix BOOKING
router.put('/bookings/:id/cancel', controller.cancelBooking);
// REJECT
router.post('/reject/:id', auth, controller.reject);
// APPROVE KBZPAY
router.put('/kbz/approve/:id', auth, controller.approveKBZPayment);

module.exports = router;