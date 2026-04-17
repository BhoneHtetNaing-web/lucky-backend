const pool = require('../../config/db');

const createBooking = async (userId, data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

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

    await client.query('COMMIT');

    return booking;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { createBooking };