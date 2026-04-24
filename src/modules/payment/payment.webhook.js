const db = require("../../config/db");

const kbzWebhook = async (req, res) => {
    const { orderId, status } = req.body;

    await db.query(
        `UPDATE payments SET status=$1 WHERE transaction_id=$2`,
        [status === "SUCCESS" ? "paid" : "failed", orderId]
    );

    res.sendStatus(200);
};

module.exports = { kbzWebhook };