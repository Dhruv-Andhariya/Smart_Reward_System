const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateUserRole } = require("../controller/userController");
const protect = require("../middlewares/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    user: req.user
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update-role", protect, updateUserRole);

module.exports = router;