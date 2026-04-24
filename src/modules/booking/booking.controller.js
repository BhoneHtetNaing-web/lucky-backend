const db = require('../../config/db');
const service = require('./booking.service');
const { validateBooking } = require('./booking.validation');
const { createCheckoutSession } = require('../payment/payment.service');

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { error } = validateBooking.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        
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

const selectSeat = async (req, res) => {
    const { flightId, seat } = req.body;

    // emit to all users in that flight
    global.io.to(flightId).emit("seatUpdate", {
        seat,
        status: "booked",
    });

    res.json({ success: true });
};

module.exports = { createBooking, getMyBookings, selectSeat }