const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Missing email or password" });
  }

  next();
};

module.exports = { validateLogin };