const db = require('../../config/db');
const service = require('./booking.service');
const { createBookingSchema } = require('./booking.validation');
const { createCheckoutSession } = require('../payment/payment.service');

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { error } = createBookingSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const { offerId, total } = req.body;
        const userId = req.user.id;

        const { flightId } = req.body;
        
        // Step 1: Create booking + passengers

        const { flight_id, seats, total_price } = req.body;
        const user_id = req.user.id; // from auth middleware

        const result = await db.query(
            `INSERT INTO bookings (user_id, flight_id, seats, total_price)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [user_id, flight_id, seats, total_price]
        );

        // Step 2: Create Stripe checkout session
        const session = await createCheckoutSession(result);

        res.status(201).json({
            success:true,
            booking: result.rows[0],
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