const axios = require('axios');

const API_KEY = process.env.KIWI_API_KEY;

const searchFlights = async ( from, to, date ) => {
        const res = await axios.get(
            "https://api.tequila.kiwi.com/v2/search",
            {
                headers: {
                    apikey: API_KEY,
                },
                params: {
                    fly_from: from,
                    fly_to: to,
                    date_from: date,
                    date_to: date,
                    curr: "USD",
                    limit: 10
                },
            }
        );

        return res.data.data;
    };

module.exports = { searchFlights };