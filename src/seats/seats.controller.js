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

const lockSeat = async (req, res) => {
  const { flightId, seat, userId } = req.body;

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  // check if already locked
  const existing = await db.query(
    "SELECT * FROM seat_locks WHERE flight_id=$1 AND seat=$2 AND expires_at > NOW()",
    [flightId, seat]
  );

  if (existing.rows.length > 0) {
    return res.status(400).json({ msg: "Seat already locked" });
  }

  await db.query(
    "INSERT INTO seat_locks (flight_id, seat, user_id, expires_at) VALUES ($1,$2,$3,$4)",
    [flightId, seat, userId, expiresAt]
  );

  // 🔥 broadcast
  global.io.to(flightId).emit("seatUpdate", {
    seat,
    status: "locked",
    expiresAt,
  });

  res.json({ success: true, expiresAt });
};

module.exports = { getSeats, holdSeat, lockSeat };