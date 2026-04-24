const service = require('./admin.service');
const db = require("../../config/db");

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

const getDashboard = async (req, res) => {
  try {
    const users = await db.query("SELECT COUNT() FROM users");
    const bookings = await db.query("SELECT COUNT() FROM bookings");
    const payments = await db.query("SELECT SUM(amount) FROM payments");

    res.json({
      users: users.rows[0].count,
      bookings: bookings.rows[0].count,
      revenue: payments.rows[0].sum || 0,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getBookings = async (req, res) => {
  const result = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
  res.json(result.rows);
};

const getPayments = async (req, res) => {
  const result = await db.query("SELECT * FROM payments ORDER BY created_at DESC");
  res.json(result.rows);
};

// 
const getStats = async (req, res) => {
    const data = await service.getDashboardStats();
    const users = await db.query("SELECT COUNT(*) FROM users");
    const bookings = await db.query("SELECT COUNT(*) FROM bookings");
    const payments = await db.query("SELECT COUNT(*) FROM payments WHERE status='submitted'");

    res.json({
        data,
        users: users.rows[0].count,
        bookings: bookings.rows[0].count,
        pendingPayments: payments.rows[0].count
    });
};

const getBookingById = async (req, res) => {
    const data = await service.getBookingDetails(req.params.id);
    res.json(data);
};

const cancelBooking = async (req, res) => {
    const data = await service.cancelBooking(req.params.id);
    res.json(data);
};

const approveBooking = async (req, res) => {
    const { id } = req.params.id;

    await db.query("UPDATE payments SET status='approved' WHERE id=$1", [id]);

    const result = await db.query(`
        UPDATE bookings
        SET status='approved'
        WHERE id=(SELECT booking_id FROM payments WHERE id=$1) RETURNING *
        `, [id]);

        res.json(result.rows[0]);
};

const reject = async (req, res) => {
    const id = req.params.id;

    await db.query("UPDATE payments SET status='rejected' WHERE id=$1", [id]);

    res.json({ message: "Rejected" });
};

const approvePayment = async (req, res) => {
    const { paymentId } = req.params.id;

    // 1) ADMIN APPROVE PAYMENT
    const payment = await db.query(
        "SELECT * FROM payments WHERE id=$1",
        [paymentId]
    );

    const bookingId = payment.rows[0].booking_id;
    // 2) approve payment
    await db.query(
        `UPDATE payments SET status='approved' WHERE id=$1`,
        [paymentId]
    );

    // 3) confirm booking
    await db.query(
        `UPDATE bookings
        SET status='confirmed'
        WHERE id=(SELECT booking_id FROM payments WHERE id=$1)`,
        [bookingId]
    );

    res.json({ message: "Approved & Booking Confirmed" });
};

const approveKBZPayment = async (req, res) => {
  const { id } = req.params;

  const payment = await pool.query(
    `UPDATE payments SET status='SUCCESS' WHERE id=$1 RETURNING *`,
    [id]
  );

  const bookingId = payment.rows[0].booking_id;

  await pool.query(
    `UPDATE bookings SET status='CONFIRMED' WHERE id=$1`,
    [bookingId]
  );

  res.json({ success: true });
};

module.exports = {
    getDashboard,
    getBookings,
    getBookingById,
    approvePayment,
    cancelBooking,
    approveBooking,
    reject,
    getPayments,
    approveKBZPayment,
    getStats,
};