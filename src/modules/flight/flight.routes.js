const express = require('express');
const router = express.Router();
const { getFlights } = require('./flight.controller');

router.get('/search', getFlights);

module.exports = router;