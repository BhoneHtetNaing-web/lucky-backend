import axios from "axios";

const db = require("../../config/db");
const { hashPassword, comparePassword } = require("../../utils/hash");

const API_URL = "http://192.168.100.69:5000/api/auth";

const createUser = async (email, password) => {
  const hashed = await hashPassword(password);

  const result = await db.query(
    "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING *",
    [email, hashed, "user"]
  );

  return result.rows[0];
};

const loginUser = async (email, password) => {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    const user = result.rows[0];
    if (!user) throw new Error("User not found");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Wrong password");

    // //
    return generateTokens(user.rows[0]);

    const token = jwt.sign(
        { id: user.rows[0].id },
        "SECRET_KEY",
        { expiresIn: "7d" }
    );

    return { user, token };
};

module.exports = { generateTokens, createUser, loginUser }