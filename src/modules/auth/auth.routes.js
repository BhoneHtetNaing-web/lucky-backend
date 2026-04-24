const router = require("express").Router();
const { register, login } = require("./auth.controller");
const { validateLogin } = require("../../middleware/validate");

router.post('/register', register);
router.post('/login', validateLogin, login);

module.exports = router;