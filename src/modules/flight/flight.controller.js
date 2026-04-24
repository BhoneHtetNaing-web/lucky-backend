const axios = require('axios');

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.body;

    const response = await axios.post(
      'https://api.duffel.com/air/offer_requests',
      {
        slices: [
          {
            origin,
            destination,
            departure_date: date,
          },
        ],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
          'Duffel-Version': 'v1',
          'Content-Type': 'application/json',
        },
      }
    );

    const cache = {};
    if (cache[key]) return res.json(cache[key]);

    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: 'Flight search failed' });
  }
};

module.exports = { searchFlights };