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

const verifyKBZ = async (req, res) => {
    const data = await service.verifyKBZPayment(req.params.id);
    res.json(data);
}

const getStats = async (req, res) => {
    const data = await service.getDashboardStats();
    res.json(data);
};

module.exports = {
    getBookings,
    getBookingById,
    cancelBooking,
    getPayments,
    getStats,
};