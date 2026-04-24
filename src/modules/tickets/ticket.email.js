const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTicketEmail = async (userEmail, pdfBuffer) => {
  await transporter.sendMail({
    from: "Lucky Travel ✈️",
    to: userEmail,
    subject: "Your Flight Ticket",
    text: "Attached is your boarding pass",
    attachments: [
      {
        filename: "ticket.pdf",
        content: pdfBuffer,
      },
    ],
  });
};

module.exports = { sendTicketEmail };