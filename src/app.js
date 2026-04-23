const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // ❗ VERY IMPORTANT

// ✅ Routes
const authRoutes = require("./modules/auth/auth.routes");
const bookingRoutes = require("./modules/booking/booking.routes");
const paymentRoutes = require("./modules/payment/payment.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const visaRoutes = require("./modules/visa/visa.routes");
const contactRoutes = require("./modules/contact/contact.routes");
const flightRoutes = require("./modules/flight/flight.routes");

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/visa", visaRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Lucky Travel API Running");
});

module.exports = app;