const express = require('express');
const router = express.Router();
const multer = require("multer");

const db = require("../../config/db");

const controller = require('./payment.controller');
const webhook = require('./payment.webhook');
const auth = require("../../middleware/auth.middleware");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/', auth, controller.createPayment);

router.post("/upload/:id", upload.single("image"), controller.uploadProof);

router.post('/upload-proof/:id', upload.single("image"), (req, res) => {
    res.json({
        message: "Uploaded",
        file: req.file.filename
    });
});

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    controller.handleWebhook
);
router.post('/kbz-webhook', webhook.kbzWebhook);
router.post('/kbz/callback', async (req, res) => {
    const { order_id, status } = req.body;

    if (status === "SUCCESS") {
        await db.query(
            "UPDATE bookings SET status='confirmed' WHERE id=$1",
            [order_id]
        );
    }
    res.send("OK");
});

module.exports = router;