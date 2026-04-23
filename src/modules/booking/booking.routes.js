const router = require("express").Router();
const { createBooking } = require("./booking.controller");
const auth = require("../../middleware/admin.middleware");

router.post('/', auth, createBooking);
// router.get('/my', auth, controller.getMyBookings);

module.exports = router;