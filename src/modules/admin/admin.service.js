const pool = require("../../config/db");

// Get all bookings
const getAllBookings = async () => {
  const result = await pool.query(`
        SELECT * FROM bookings
        ORDER BY created_at DESC
        `);

  return result.rows;
};

// Booking details with passengers
const getBookingDetails = async (bookingId) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  const passengers = await pool.query(
    `SELECT * FROM passengers WHERE booking_id=$1`,
    [bookingId],
  );

  return {
    booking: booking.rows[0],
    passengers: passengers.rows,
  };
};

// Verify Payment
const verifyKBZPayment = async (id) => {
  const verification = await pool.query(
    `SELECT * FROM kbzpay_verifications WHERE id=$1`,
    [id]
  );

  const bookingId = verification.rows[0].booking_id;

  // update booking
  await pool.query(
    `UPDATE bookings SET status='CONFIRMED' WHERE id=$1`,
    [bookingId]
  );

  // update verification
  await pool.query(
    `UPDATE kbzpay_verifications SET status='APPROVED' WHERE id=$1`,
    [id]
  );

  return { success: true };
};

// Cancel Booking
const cancelBooking = async (bookingId) => {
  const result = await pool.query(
    `UPDATE bookings SET status='CANCELLED' WHERE id=$1 RETURNING *`,
    [bookingId],
  );

  return result.rows[0];
};

// Payments list
const getPayments = async () => {
  const result = await pool.query(`
        SELECT * FROM payments
        ORDER BY created_at DESC
        `);

  return result.rows;
};

// Dashboard summary
const getDashboardStats = async () => {
  const bookings = await pool.query(`
        SELECT COUNT(*) FROM bookings
        `);

  const revenue = await pool.query(`
        SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='SUCCESS'
        `);

  const today = await pool.query(`
    SELECT COUNT(*) FROM bookings
    WHERE DATE(created_at) = CURRENT_DATE
    `);

    return {
        total_bookings: bookings.rows[0].count,
        total_revenue: revenue.rows[0].coalesce,
        today_bookings: today.rows[0].count,
    };
};

module.exports = {
    getAllBookings,
    getBookingDetails,
    cancelBooking,
    getPayments,
    getDashboardStats,
};