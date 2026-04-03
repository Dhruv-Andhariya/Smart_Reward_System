const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  cashback: Number,     // flat cashback
  percentage: Number,   // percentage cashback
  maxCap: Number,
  validFrom: Date,
  validTo: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);