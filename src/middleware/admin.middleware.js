const jwt = require("jsonwebtoken");
const db = require("../config/db");

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ msg: "Admin Only" });
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

module.exports = { adminMiddleware, adminAuth };