const express = require('express');
const router = express.Router();
const controller = require("./booking.controller");
const auth = require("../../middleware/admin.middleware");

const { createBooking } = require('./booking.controller');

router.post('/', auth, controller.createBooking);
router.get('/my', auth, controller.getMyBookings);

module.exports = router;