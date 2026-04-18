const express = require('express');
const router = express.Router();

// const { getFlights } = require('./flight.controller');
const controller = require("./flight.controller");

router.get("/search", controller.searchFlights);
// router.get('/search', getFlights);

module.exports = router;