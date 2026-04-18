// const adminAuth = (req, res, next) {
//     const key = req.headers['x-admin-key'];

//     if (!key || key !== process.env.ADMIN_SECRET) {
//         return res.status(403).json({ error: "Unauthorized" });
//     }

//     next();
// };

// module.exports = adminAuth;