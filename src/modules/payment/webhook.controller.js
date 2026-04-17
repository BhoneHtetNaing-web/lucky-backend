const stripe = require('../../config/stripe');
const pool = require('../../config/db');

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

module.exports = { handleWebhook };