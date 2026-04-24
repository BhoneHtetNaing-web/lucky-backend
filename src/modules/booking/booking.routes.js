const router = require("express").Router();
const { createBooking } = require("./booking.controller");
const auth = require("../../middleware/admin.middleware");

router.post('/', auth, createBooking);

module.exports = router;