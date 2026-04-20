const service = require('./admin.service');
const db = require("../../config/db");

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

const dashboard = async (req, res) => {
    const users = await db.query("SELECT COUNT(*) FROM users");
    const bookings = await db.query("SELECT COUNT(*) FROM bookings");

    res.json({
        users: users.rows[0].count,
        bookings: bookings.rows[0].count
    });
};

const getBookings = async (req, res) => {
    const data = await service.getAllBookings();
    res.json(data);
};

const getBookingById = async (req, res) => {
    const data = await service.getBookingDetails(req.params.id);
    res.json(data);
};

const cancelBooking = async (req, res) => {
    const data = await service.cancelBooking(req.params.id);
    res.json(data);
};

const getPayments = async (req, res) => {
    const data = await db.query(`
        SELECT p.id, p.status, p.proof_image,
        b.id as booking_id,
        u.name, u.email
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN users u ON b.user_id = u.id
        ORDER BY p.id DESC
        `);

    res.json(data.rows);
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

exports.approvePayment = async (req, res) => {
    const paymentId = req.params.id;

    // 1) approve payment
    await db.query(
        `UPDATE payments SET status='approved' WHERE id=$1`,
        [paymentId]
    );

    // 2) confirm booking
    await db.query(
        `UPDATE bookings
        SET status='confirmed'
        WHERE id=(SELECT booking_id FROM payments WHERE id=$1)`,
        [paymentId]
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

module.exports = {
    dashboard,
    getBookings,
    getBookingById,
    cancelBooking,
    approveBooking,
    reject,
    getPayments,
    approveKBZPayment,
    getStats,
};