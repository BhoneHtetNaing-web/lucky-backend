const express = require('express');
const router = express.Router();
const multer = require("multer");

const controller = require('./payment.controller');

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/', controller.createPayment);

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

module.exports = router;