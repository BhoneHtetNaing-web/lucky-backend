const pool = require("../config/db");

const getSeats = async (req, res) => {
    const { offerId } = req.params;

    const seats = await pool.query(
        "SELECT * FROM seats WHERE offer_id=$1",
        [offerId]
    );

    res.json(seats.rows);
};

const holdSeat = async (req, res) => {
    const { seat, offerId } = req.body;
    const userId = req.user.id;

    const check = await pool.query(
        "SELECT * FROM seats WHERE offer_id=$1 AND seat_number=$2",
        [offerId, seat]
    );

    if (check.rows.length === 0)
        return res.status(404).json({ error: "Seat not found" });

    const seatData = check.rows[0];

    if (seatData.status !== "available")
        return res.status(400).json({ error: "Seat not available" });

    await pool.query(
        `UPDATE seats
        SET status='held',
            user_id=$1,
            hold_expires_at=NOW() + INTERVAL '10 minutes'
        WHERE id=$2`,
        [userId, seatData.id]
    );

    res.json({ message: "Seat held" });
};

module.exports = { getSeats, holdSeat }