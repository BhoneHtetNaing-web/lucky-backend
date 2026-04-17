const pool = require('../../config/db');

const saveVerification = async (data) => {
    const result = await pool.query(
        `INSERT INTO kbzpay_verifications (booking_id, screenshot_url, user_phone)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [data.booking_id, data.screenshot_url, data.user_phone]
    );

    return result.rows[0];
};

module.exports = { saveVerification };