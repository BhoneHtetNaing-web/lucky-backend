
const router = require("express").Router();

const { searchFlights } = require("./flight.controller");

router.post("/search", searchFlights);

module.exports = router;