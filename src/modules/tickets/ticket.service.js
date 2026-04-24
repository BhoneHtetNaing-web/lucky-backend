const { sendTicketEmail } = require("./ticket.email");
const { generateQR } = require("./qr");
const { generatePDF } = require("./pdf");

const issueTicket = async (booking) => {
  const qr = await generateQR(booking.id);
  // 1. generate PDF
  const pdf = await generatePDF(booking, qr);

  // 2. send email
  await sendTicketEmail(booking.user_email, pdf);

  return { qr, pdf };
};

module.exports = { issueTicket };