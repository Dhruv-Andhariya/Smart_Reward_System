const Offer = require("../models/Offer");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

const getOffers = async (req, res) => {
  const offers = await Offer.find({ restaurantId: req.params.id });
  res.json(offers);
};

const createOffer = async (req, res) => {
  try {
    const {
      restaurantId,
      minAmount,
      cashback,
      percentage,
      maxCap,
      validFrom,
      validTo
    } = req.body;

    const parsedMinAmount = Number(minAmount);
    const parsedCashback = cashback !== undefined && cashback !== null && cashback !== "" ? Number(cashback) : undefined;
    const parsedPercentage = percentage !== undefined && percentage !== null && percentage !== "" ? Number(percentage) : undefined;
    const parsedMaxCap = maxCap !== undefined && maxCap !== null && maxCap !== "" ? Number(maxCap) : undefined;
    const parsedValidFrom = validFrom ? new Date(validFrom) : null;
    const parsedValidTo = validTo ? new Date(validTo) : null;

    // REQUIRED CHECK
    if (!restaurantId || Number.isNaN(parsedMinAmount)) {
      return res.status(400).json({ message: "restaurantId and minAmount required" });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId format" });
    }

    // CHECK RESTAURANT EXISTS
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ONLY ONE TYPE OF OFFER
    if (parsedCashback !== undefined && parsedPercentage !== undefined) {
      return res.status(400).json({
        message: "Use either cashback OR percentage, not both"
      });
    }

    if (parsedCashback === undefined && parsedPercentage === undefined) {
      return res.status(400).json({
        message: "At least one offer type required"
      });
    }

    // NEGATIVE VALUE CHECK
    if (parsedMinAmount <= 0) {
      return res.status(400).json({ message: "minAmount must be > 0" });
    }

    if (parsedCashback !== undefined && parsedCashback <= 0) {
      return res.status(400).json({ message: "cashback must be > 0" });
    }

    if (parsedPercentage !== undefined && (parsedPercentage <= 0 || parsedPercentage > 100)) {
      return res.status(400).json({ message: "percentage must be 1-100" });
    }

    if (parsedMaxCap !== undefined && parsedMaxCap <= 0) {
      return res.status(400).json({ message: "maxCap must be > 0" });
    }

    if (!parsedValidFrom || !parsedValidTo || Number.isNaN(parsedValidFrom.getTime()) || Number.isNaN(parsedValidTo.getTime())) {
      return res.status(400).json({
        message: "validFrom and validTo are required"
      });
    }

    // DATE VALIDATION
    if (parsedValidFrom > parsedValidTo) {
      return res.status(400).json({
        message: "validFrom cannot be after validTo"
      });
    }

    const offer = await Offer.create({
      restaurantId,
      minAmount: parsedMinAmount,
      cashback: parsedCashback,
      percentage: parsedPercentage,
      maxCap: parsedMaxCap,
      validFrom: parsedValidFrom,
      validTo: parsedValidTo
    });

    res.status(201).json({
      message: "Offer created successfully",
      offer
    });

  } catch (error) {
    res.status(500).json({
      message: error?.message || "Failed to create offer"
    });
  }
};

module.exports = { getOffers, createOffer };