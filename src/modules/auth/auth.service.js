const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const generateTokens = (user) => {
    const accessToken = jwt.sign(

        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRE }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRE }
    );

    return { accessToken, refreshToken };
};

exports.register = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await db.query(
        "INSERT INTO users(name,email,phone,password) VALUES($1,$2,$3,$4) RETURNING *",
        [data.name, data.email, data.phone, hashed]
    );

    return user.rows[0];
};

exports.login = async (email, password) => {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (!user.rows.length) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) throw new Error("Wrong password");

    return generateTokens(user.rows[0]);

    const token = jwt.sign(
        { id: user.rows[0].id },
        "SECRET_KEY",
        { expiresIn: "7d" }
    );

    return { user: user.rows[0], token };
};