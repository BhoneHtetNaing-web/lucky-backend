const service = require('./admin.service');

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
    const data = await service.getPayments();
    res.json(data);
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
    res.json(data);
};

module.exports = {
    getBookings,
    getBookingById,
    cancelBooking,
    getPayments,
    approveKBZPayment,
    getStats,
};