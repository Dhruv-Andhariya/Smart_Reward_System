const Restaurant = require("../models/Restaurant");
const Offer = require("../models/Offer");

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error: error.message });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const { name, location, category, menu } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Restaurant name is required" });
    }

    const restaurant = await Restaurant.create({
      name,
      location,
      category,
      menu: Array.isArray(menu) ? menu : []
    });

    res.status(201).json({
      message: "Restaurant added",
      restaurant
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price, isAvailable } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Menu item name and price are required" });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu.push({
      name,
      description,
      imageUrl,
      price,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    });

    await restaurant.save();
    const menuItem = restaurant.menu[restaurant.menu.length - 1];

    res.status(201).json({
      message: "Menu item added",
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (updates.name !== undefined) menuItem.name = updates.name;
    if (updates.description !== undefined) menuItem.description = updates.description;
    if (updates.imageUrl !== undefined) menuItem.imageUrl = updates.imageUrl;
    if (updates.price !== undefined) menuItem.price = updates.price;
    if (updates.isAvailable !== undefined) menuItem.isAvailable = Boolean(updates.isAvailable);

    await restaurant.save();

    res.json({
      message: "Menu item updated",
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.deleteOne();
    await restaurant.save();

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Offer.deleteMany({ restaurantId: id });
    await restaurant.deleteOne();

    res.json({ message: "Restaurant removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant", error: error.message });
  }
};

module.exports = {
  getRestaurants,
  addRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteRestaurant
};