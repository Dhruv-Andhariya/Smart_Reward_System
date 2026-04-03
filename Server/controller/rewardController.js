const Reward = require("../models/Reward");

const getRewards = async (req, res) => {
  try {
    const query = req.user?.role === "admin" ? {} : { userId: req.user._id };
    const rewards = await Reward.find(query).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getRewards, getUserRewards };
