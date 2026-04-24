const db = require("../../config/db");

const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    await db.query(
        "INSERT INTO messages (name, email, message) VALUES ($1,$2,$3)",
        [name, email, message]
    );

    res.json({ success: true });
};

module.exports = { sendMessage }