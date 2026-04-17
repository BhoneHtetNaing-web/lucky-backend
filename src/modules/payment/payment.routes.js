const express = require('express');
const router = express.Router();

const { createPayment } = require('./payment.controller');
const { handleWebhook } = require('./webhook.controller');

router.post('/create', createPayment);

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleWebhook
);

module.exports = router;