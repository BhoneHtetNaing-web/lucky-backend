const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const { registerSchema } = require("./auth.validation");

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❗ check input
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // check existing user
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❗ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ❗ insert into DB
    await pool.query("INSERT INTO users (email, password) VALUES ($1,$2)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({
      message: "Register success",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Register failed" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1.Find user
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // 2. Compare password (IMPORTANT)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong Password" });
    }

    // 3.Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login success",
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };
