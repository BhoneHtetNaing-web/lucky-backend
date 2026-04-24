const router = require("express").Router();
const { createBooking } = require("./booking.controller");
const { validateBooking } = require("./booking.validation");

router.post('/', validateBooking, createBooking);

module.exports = router;