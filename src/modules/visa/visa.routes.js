const router = require("express").Router();
const controller = require("./visa.controller");

router.post("/apply", controller.applyVisa);

module.exports = router;