const { createCheckoutSession } = require('./payment.service');
const pool = require('../../config/db');
const stripe = require('../../config/stripe');

const createPayment = async (req, res) => {
    try {
        const { bookingId, provider, amount } = req.body;

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

        const payment = await pool.query(
          `INSERT INTO payments(booking_id, provider, amount)
          VALUES($1,$2,$3) RETURNING *`,
          [bookingId, provider, amount]
        );

        const session = await createCheckoutSession(booking);

        res.json(payment.rows[0], session.url);
    } catch (err) {
        res.status(500).json({
            error: "Payment init failed"
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

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const bookingId = session.metadata.booking_id;

    try {
      // ✅ Update booking status
      await pool.query(
        `UPDATE bookings SET status='CONFIRMED' WHERE id=$1`,
        [bookingId]
      );

      // ✅ Insert payment record
      await pool.query(
        `INSERT INTO payments (booking_id, amount, status, transaction_id)
         VALUES ($1, $2, 'SUCCESS', $3)`,
        [
          bookingId,
          session.amount_total / 100,
          session.payment_intent,
        ]
      );

      console.log('✅ Payment success for booking:', bookingId);

      if (bookingId.status === 'CONFIRMED') {
        return;
      }

    } catch (dbErr) {
      console.error('DB error:', dbErr.message);
    }
  }

  res.json({ received: true });
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

module.exports = { createPayment, createKBZPayment, uploadProof, handleWebhook, payBooking };