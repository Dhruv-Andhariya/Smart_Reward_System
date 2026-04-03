const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  category: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  menu: {
    type: [menuItemSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);