

const express = require('express');
const cors = require('cors');

const flightRoutes = require('./modules/flight/flight.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const kbzRoutes = require('./modules/kbzpay/kbzpay.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kbzpay', kbzRoutes);

module.exports - app;