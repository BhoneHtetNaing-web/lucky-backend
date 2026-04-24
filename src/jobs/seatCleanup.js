setInterval(async () => {
  const expired = await db.query(
    "DELETE FROM seat_locks WHERE expires_at < NOW() RETURNING *"
  );

  expired.rows.forEach((row) => {
    global.io.to(row.flight_id).emit("seatUpdate", {
      seat: row.seat,
      status: "available",
    });
  });
}, 10000); // every 10 sec