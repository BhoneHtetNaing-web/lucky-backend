const axios = require('axios');

const API_KEY = process.env.RAPIDAPI_KEY;

const searchFlights = async ({ from, to, date }) => {
        const response = await axios.get(
            "https://skyscanner44.p.rapidapi.com/search",
            {
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                },
                params: {
                    origin: from,
                    destination: to,
                    departureDate: date,
                },
            }
        );

        return response.data;
    };

module.exports = { searchFlights };