const QRCode = require("qrcode");

const generateQR = async (ticketId) => {
  return await QRCode.toDataURL(ticketId);
};

module.exports = { generateQR };