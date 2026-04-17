const axios = require('axios');

const searchFlights = async ({ from, to, date }) => {
    try {
        const response = await axios.get(
            `https://${process.env.RAPIDAPI_HOST}/v3/flights/search`,
            {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-HOST': process.env.RAPIDAPI_HOST,
                },
                params: {
                    origin: from,
                    destination: to,
                    date: date,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error('Flight search failed');
    }
};

module.exports = { searchFlights };