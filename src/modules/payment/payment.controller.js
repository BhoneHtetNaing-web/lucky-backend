const { createCheckoutSession } = require('./payment.service');
const pool = require('../../config/db');

const createPayment = async (req, res) => {
    try {
        const { booking_id } = req.body;

        const bookingResult = await pool.query(
            'SELECT * FROM bookings WHERE id=$1',
            [booking_id]
        );

        const booking = bookingResult.rows[0];

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'CONFIRMED') {
            return res.status(400).json({
                message: 'This booking is already paid',
            });
        }

        const session = await createCheckoutSession(booking);

        res.json({
            url: session.url,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const createKBZPayment = async (req, res) => {
    const { booking_id } = req.body;

    const fakePaymentLink = `kbzpay://pay?amount=100&booking=${booking_id}`;

    res.json({
        payment_url: fakePaymentLink,
        method: 'KBZPay',
    });
};

module.exports = { createPayment, createKBZPayment };