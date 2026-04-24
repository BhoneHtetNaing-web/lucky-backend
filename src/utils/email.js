const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTicket = async (to, booking) => {
  await transporter.sendMail({
    from: "Lucky Travel ✈️",
    to,
    subject: "Your Flight Ticket",
    html: `
    <div style="font-family:sans-serif">
      <h2>Lucky Treasure Travel</h2>
      <p><b>Flight:</b> ${booking.flight}</p>
      <p><b>Seats:</b> ${booking.seats}</p>
      <p><b>Status:</b> CONFIRMED</p>

      <hr />

      <p>Show this email at airport check-in.</p>
    </div>
    `,
  });
};

module.exports = { sendTicket };