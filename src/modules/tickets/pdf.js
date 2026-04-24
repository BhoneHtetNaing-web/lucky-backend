const puppeteer = require("puppeteer");

const generatePDF = async (ticket, qr) => {
  const html = `
    <h1>✈️ Boarding Pass</h1>
    <p>Flight: ${ticket.flight_id}</p>
    <p>Seat: ${ticket.seat}</p>
    <img src="${qr}" />
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf();

  await browser.close();

  return pdf;
};

module.exports = { generatePDF };