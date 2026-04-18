const { searchFlights }, service = require('./flight.service');

const searchFlights = async (req, res) => {
    const { from, to, date } = req.query;

    const data = await service.searchFlights(from, to, date);

    res.json(data);
};

// const getFlights = async (req, res) => {
//     try {
//         const { from, to, date } = req.query;

//         if (!from || !to || !date) {
//             return res.status(400).json({
//                 message: 'Missing parameters',
//             });
//         }

//         const flights = await searchFlights({ from, to, date });

//         res.json({
//             success: true,
//             data: flights,
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// };

module.exports = { searchFlights };