const service = require("./auth.service");
const { registerSchema } = require("./auth.validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../config/db");

const refresh = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccess = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccess });

    } catch {
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

const register = async (req, res) => {
        const { email, password } = req.body; // MUST HAVE THIS

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        const user = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashed]
        );

        res.json(user.rows[0]);
    };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ check user
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
        }

    // 2️⃣ check password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 3️⃣ create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ send response
    return res.json({
      message: "Login successful",
      token,
       user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { refresh, register, login }