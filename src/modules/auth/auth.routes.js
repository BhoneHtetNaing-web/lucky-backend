const router = require("express").Router();

const controller = require("./auth.controller");
const auth = require("../../middleware/auth");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/refresh", controller.refresh);

router.get("/profile", auth, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;