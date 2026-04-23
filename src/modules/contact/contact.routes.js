const router = require("express").Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  
  console.log("📩 Contact Message:", req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  return res.json({
    message: "Message received successfully",
  });
});

module.exports = router;
