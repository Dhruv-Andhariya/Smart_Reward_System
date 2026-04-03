const express = require("express");
const router = express.Router();

const { getOffers, createOffer } = require("../controller/offerController");
const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

router.get("/:id", getOffers);

// 🔥 ADMIN ONLY ROUTE
router.post("/", protect, adminOnly, createOffer);

module.exports = router;