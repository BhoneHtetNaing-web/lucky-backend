const pool = require("../config/db");

setInterval(async () => {
    await pool.query(`
        UPDATE seats
        SET status='available'
            user_id=NULL,
            hold_expires_at=NULL
        WHERE hold_expires_at < NOW()
        `);

        console.log("Expired seats released");
}, 60000);