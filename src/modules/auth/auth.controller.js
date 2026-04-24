const jwt = require("../../utils/jwt");
const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const { registerSchema } = require("./auth.validation");
const crypto = require("crypto");

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
    // ❗ hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // ❗ insert into DB
    // const result = await pool.query(
    //   "INSERT INTO users (email, password) VALUES ($1,$2)",
    //   [email, hashedPassword],
    // );

    const user = await createUser(email, password);

    // ❗ check input
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // check existing user
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1.Find user
    const user = await loginUser(email, password);

    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id=$1",
      [user.id]
    )

    if (!email || !password) {
      return res.json(400).json({ msg: "Missing fields" });
    }

    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  await db.query(
    "UPDATE users SET otp=$1, otp_expiry=NOW() + INTERVAL '5 minutes' WHERE email=$2",
    [otp, email],
  );

  await transporter.sendMail({
    to: email,
    subject: "Your OTP Code",
    html: `<h2>${otp}</h2>`,
  });

  res.json({ msg: "OTP sent" });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  if (
    user.rows[0].otp !== otp ||
    new Date(user.rows[0].otp_expiry) < new Date()
  ) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  await db.query("UPDATE users SET verified=true WHERE email=$1", [email]);

  res.json({ success: true });
};

module.exports = { register, login, sendOTP, verifyOTP };
