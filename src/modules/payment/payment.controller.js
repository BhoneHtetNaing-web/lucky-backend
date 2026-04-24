const paymentService = require('./payment.service');
const db = require('../../config/db');
const stripe = require('../../config/stripe');

const createPayment = async (req, res) => {
        const { amount, booking_id, provider, method, txn_ref, screenshot } = req.body;
        const user_id = req.user.id;

        const orderId = "ORD-" + Date.now();

        try {
          let paymentUrl;

          if (provider === "KBZPAY") {
            const result = await paymentService.createKBZPayPayment({
              amount,
              orderId,
            });

            paymentUrl = result.payment_url;
          }

          if (provider === "WAVEPAY") {
            const result = await paymentService.createWavePayPayment({
              amount,
              orderId,
            })

            paymentUrl = result.payment_url;
          }

          await db.query(
            `INSERT INTO payments (booking_id, user_id, amount, provider, transaction_id)
            VALUES ($1,$2,$3,$4,$5)`,
            [booking_id, user_id, amount, provider, orderId, method, txn_ref, screenshot]
          );

          res.json({ paymentUrl });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }

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

        res.json(payment.rows[0], session.url);
    };

const uploadProof = async (req, res) => {
    const paymentId = req.params.id;
    const { imageUrl } = req.body;
    const file = req.file.filename;

    await pool.query(
        `UPDATE payments
        SET proof_image=$1, status='submitted'
        WHERE id=$2`,
        [file, paymentId, imageUrl]
    );

    res.json({ message: "Proof uploaded" });
};

const payBooking = async (req, res) => {
  const { booking_id, amount, method } = req.body;

  await pool.query(
    'INSERT INTO payments(booking_id, amount, method) VALUES($1,$2,$3)',
    [booking_id, amount, method]
  );

  await pool.query(
    'UPDATE bookings SET status = $1 WHERE id = $2',
    ['paid', booking_id]
  );

  res.json({ message: 'Payment success' });
};

const approvePayment = async (req, res) => {
  const id = req.params.id;

  await db.query(
    "UPDATE payments SET status='paid' WHERE id=$1",
    [id]
  );

  await db.query(
    "UPDATE bookings SET payment_status='paid', status='confirmed' WHERE id=(SELECT booking_id FROM payments WHERE id=$1)",
    [id]
  );

  await sendTicket(user.email, {
    flight: "YGN-BKK",
    seats: "12A, 12B",
  });
  
  res.json({ success: true });
};

module.exports = { createPayment, uploadProof, payBooking, approvePayment };