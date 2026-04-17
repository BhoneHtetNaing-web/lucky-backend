const express = require('express');
const router = express.Router();

const upload = require('../../middleware/upload');
const controller = require('./kbzpay.controller');

router.post('/submit', upload.single('screenshot'), controller.submitKBZPayment);

module.exports = router;