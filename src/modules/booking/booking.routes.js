const express = require('express');
const router = express.Router();

const { createBookingHandler } = require('./booking.controller');

router.post('/', createBookingHandler);

module.exports = router;