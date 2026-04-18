const express = require('express');
const router = express.Router();

const upload = require('../../middleware/upload');
const controller = require('../../controllers/kbzpay.controller');

router.post('/create', controller.createKBZPayRequest);
router.post('/submit-proof', controller.submitKBZProof);
// router.post('/submit', upload.single('screenshot'), controller.submitKBZPayment);

module.exports = router;