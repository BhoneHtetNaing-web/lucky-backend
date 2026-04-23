const axios = require("axios");

const searchFlights = async (from, to, date) => {
  const res = await axios.get(
    "https://api.duffel.com/air/offer_requests", {
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Duffel-Version": "v1",
      },
    });

    return res.data;
};

module.exports = { searchFlights }