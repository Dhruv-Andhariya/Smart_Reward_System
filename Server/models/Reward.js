const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction"
  },
  rewardAmount: Number
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);