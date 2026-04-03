const express = require("express");
const router = express.Router();
const {
	getRestaurants,
	addRestaurant,
	addMenuItem,
	updateMenuItem,
	deleteMenuItem,
	deleteRestaurant
} = require("../controller/restaurantController");
const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

router.get("/", getRestaurants);
router.post("/", protect, adminOnly, addRestaurant);
router.delete("/:id", protect, adminOnly, deleteRestaurant);
router.post("/:id/menu", protect, adminOnly, addMenuItem);
router.patch("/:id/menu/:itemId", protect, adminOnly, updateMenuItem);
router.delete("/:id/menu/:itemId", protect, adminOnly, deleteMenuItem);

module.exports = router;