const PDFDocument = require("pdfkit");

const generateTicketPDF = (booking) => {
    const doc = new PDFDocument();

    doc.text("Lucky Treasure Travel", { align: "center" });
    doc.moveDown();

    doc.text(`Flight: ${booking.flight}`);
    doc.text(`Seats: ${booking.seats}`);
    doc.text(`Status: CONFIRMED`);

    doc.end();

    return doc;
};