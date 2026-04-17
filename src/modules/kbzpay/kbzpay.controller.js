const service = require('./kbzpay.service');

const submitKBZPayment = async (req, res) => {
    try {
        const { booking_id, user_phone } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: 'Screenshot required',
            });
        }

        const result = await service.saveVerification({
            booking_id,
            user_phone,
            screenshot_url: file.path,
        });

        res.json({
            success: true,
            message: 'Payment submitted for verification',
            data: result,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitKBZPayment };