const service = require('./flight.service');

exports.searchFlights = async (req, res) => {
    const { from, to, date } = req.query;

    const data = await service.searchFlights(from, to, date);

    res.json(data);
};