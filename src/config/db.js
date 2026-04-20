const { Pool } = require('pg');

const pool = new Pool({
    // connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,

});

console.log("DB PASSWORD:", process.env.DB_PASSWORD);

module.exports = pool;