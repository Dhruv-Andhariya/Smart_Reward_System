const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getRewards, getUserRewards } = require("../controller/rewardController");

router.get("/", protect, getRewards);
router.get("/user", protect, getUserRewards);

module.exports = router;
