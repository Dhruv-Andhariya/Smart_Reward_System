const Transaction = require("../models/Transaction");
const Reward = require("../models/Reward");
const Restaurant = require("../models/Restaurant");
const { calculateBestReward } = require("../services/rewardService");

const createTransaction = async (req, res) => {
  try {
    const { amount, restaurantId, items } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId is required" });
    }

    let computedItems = [];
    let totalAmount = 0;

    if (Array.isArray(items) && items.length > 0) {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      for (const item of items) {
        const menuItemId = item.menuItemId || item._id;
        const quantity = Number(item.quantity || 0);

        if (!menuItemId || quantity < 1) {
          return res.status(400).json({ message: "Invalid cart payload" });
        }

        const menuItem = restaurant.menu.id(menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({ message: "Menu item unavailable" });
        }

        const lineTotal = Number(menuItem.price) * quantity;
        totalAmount += lineTotal;

        computedItems.push({
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          lineTotal
        });
      }
    } else {
      totalAmount = Number(amount || 0);
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Transaction total must be greater than zero" });
    }

    // create transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      restaurantId,
      amount: totalAmount,
      totalAmount,
      items: computedItems
    });

    // 🔥 calculate reward
    const { bestReward, bestOffer } = await calculateBestReward(totalAmount, restaurantId);

    let rewardData = null;

    if (bestReward > 0) {
      rewardData = await Reward.create({
        userId: req.user._id,
        transactionId: transaction._id,
        rewardAmount: bestReward
      });
    }

    res.status(201).json({
      transaction,
      reward: rewardData,
      appliedOffer: bestOffer
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const query = req.user?.role === "admin" ? {} : { userId: req.user._id };
    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { createTransaction, getTransactions, getUserTransactions };