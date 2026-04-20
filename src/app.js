

const express = require('express');
const cors = require('cors');

const flightRoutes = require('./modules/flight/flight.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const kbzRoutes = require('./modules/kbzpay/kbzpay.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require("./modules/auth/auth.routes"));
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', require("./modules/booking/booking.routes"));
app.use('/uploads', express.static("uploads"));
app.use('/api/payment', require("./modules/payment/payment.routes"));
app.use('/api/admin', adminRoutes);
app.use('/api/kbzpay', kbzRoutes);

module.exports = app;