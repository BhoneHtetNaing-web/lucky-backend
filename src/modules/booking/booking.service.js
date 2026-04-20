const pool = require('../../config/db');

exports.createBooking = async (userId, flightId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

        // 1. Insert booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, flight_id, total_price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, data.flight_id, data.total_price]
    );

    const booking = bookingResult.rows[0];

    // 2. Insert passengers
    for (const p of data.passengers) {
      await client.query(
        `INSERT INTO passengers (booking_id, full_name, passport_number, nationality)
         VALUES ($1, $2, $3, $4)`,
        [booking.id, p.full_name, p.passport_number, p.nationality]
      );
    }

    // 2) auto create payment (KBZ)
    const paymentRes = await client.query(
      `INSERT INTO payments(booking_id, method, status)
      VALUES($1,'KBZ','pending') RETURNING *`,
      [booking.id]
    );

    await client.query("COMMIT");

    return {
      booking,
      payment: paymentRes.rows[0]
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  };
  
  const result = await pool.query(
    "INSERT INTO bookings(user_id, flight_id, status) VALUES($1, $2, $3) RETURNING *",
    [userId, flightId, "pending"]
  );
  return result.rows[0];
};

// module.exports = { createBooking };