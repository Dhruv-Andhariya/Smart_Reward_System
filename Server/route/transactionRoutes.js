const express = require("express");
const router = express.Router();
const { createTransaction, getTransactions, getUserTransactions } = require("../controller/transactionController");
const protect = require("../middlewares/authMiddleware");

router.get("/", protect, getTransactions);
router.get("/user", protect, getUserTransactions);
router.post("/", protect, createTransaction);

module.exports = router;