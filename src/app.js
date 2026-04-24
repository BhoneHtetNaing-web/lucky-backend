require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// IMPORTANT
const app = express();

// Security headers
app.use(helmet());

// ✅ Middlewares , CORS (strict)
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Body limit
app.use(express.json({ limit: "10kb" })); // ❗ VERY IMPORTANT

// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Logging (prod minimal)
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}

// Health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// ✅ Routes
const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const bookingRoutes = require("./modules/booking/booking.routes");
const paymentRoutes = require("./modules/payment/payment.routes");
const visaRoutes = require("./modules/visa/visa.routes");
const contactRoutes = require("./modules/contact/contact.routes");
const flightRoutes = require("./modules/flight/flight.routes");

const authMiddleware = require("./middleware/auth.middleware");

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", authMiddleware, bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/api/ticket/:id", (req, res) => {
  const booking = {
    flight: "YGN-BKK",
    seats: "12A,12B",
  };

  const pdf = generateTicketPDF(booking);

  res.setHeader("Content-Type", "application/pdf");
  pdf.pipe(res);
});

app.use("/api/contact", contactRoutes);
app.use("/api/visa", visaRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler (centralized)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: "Server error",
  });
});

app.get("/", (req, res) => {
  res.send("Lucky Treasure Travel API running 🦅");
});

module.exports = app;