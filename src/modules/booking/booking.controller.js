const db = require('../../config/db');
const service = require('./booking.service');
const { createBookingSchema } = require('./booking.validation');
const { createCheckoutSession } = require('../payment/payment.service');

const createBooking = async (req, res) => {
    try {
        const { error } = createBookingSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const userId = req.user?.id || 'demo-user-id';

        const { flightId } = req.body;
        
        // Step 1: Create booking + passengers
        const booking = await createBooking(userId, flightId);

        // Step 2: Create Stripe checkout session
        const session = await createCheckoutSession(booking);

        res.status(201).json({
            success:true,
            booking_id: booking.id,
            payment_url: session.url,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const getMyBookings = async (req, res) => {
    const result = await db.query(
        "SELECT * FROM bookings WHERE user_id = $1",
        [req.user.id]
    );

    res.json(result.rows);
};

module.exports = { createBooking, getMyBookings }