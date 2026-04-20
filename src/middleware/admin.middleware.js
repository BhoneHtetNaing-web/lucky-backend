const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No Token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin Only" });
    }
    next();
};

const adminAuth = (req, res, next) => {
    const key = req.headers['x-admin-key'];

    if (!key || key !== process.env.ADMIN_SECRET) {
        return res.status(403).json({
            message: 'Unauthorized admin access',
        });
    }

    next();
};

module.exports = adminAuth;