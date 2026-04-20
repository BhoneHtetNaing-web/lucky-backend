const service = require('./flight.service');

const searchFlights = async (req, res) => {
    try {
    const { from, to, date } = req.query;

    const flights = await service.searchFlights(from, to, date);

    res.json({
        success:true,
        results: flights
    });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { searchFlights }