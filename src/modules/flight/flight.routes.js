
const router = require("express").Router();

const controller = require("./flight.controller");

router.get("/search", controller.searchFlights);

module.exports = router;