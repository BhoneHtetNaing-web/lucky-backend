const express = require('express');
const router = express.Router();

const controller = require('./admin.controller');
const { adminMiddleware } = require('../../middleware/admin.middleware');
const authMiddleware = require("../../middleware/auth.middleware");

// Protected all routes
router.use(admin);

// DASHBOARD
router.get("/dashboard", authMiddleware, adminMiddleware, controller.getDashboard);
//
router.get('/stats', authMiddleware, controller.getStats);
// Bookings
router.get('/bookings', authMiddleware, async (req, res) => {
    // DB query here
    res.json([]);
});
// Payments
router.get('/payments', authMiddleware, async (req, res) => {
    res.json([]);
});
// Messages
router.get('/messages', authMiddleware, async (req, res) => {
    res.json([]);
});
// APPROVE
router.post('/bookings/:id/approve', authMiddleware, controller.approveBooking);
// BookingById
router.get('/bookings/:id', authMiddleware, controller.getBookingById);
// Fix BOOKING
router.put('/bookings/:id/cancel',authMiddleware, controller.cancelBooking);
// REJECT
router.post('/reject/:id', authMiddleware, controller.reject);
// APPROVE KBZPAY
router.put('/kbz/approve/:id', authMiddleware, controller.approveKBZPayment);

module.exports = router;