const router = require('express').Router();
const controller = require('../controllers/kbzpay.controller');

router.post('/create', controller.createKBZPayRequest);
router.post('/submit-proof', controller.submitKBZProof);

module.exports = router;