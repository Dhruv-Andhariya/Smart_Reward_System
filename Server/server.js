require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./route/userRoutes");
const restaurantRoutes = require("./route/restaurantRoutes");
const offerRoutes = require("./route/offerRoutes");
const transactionRoutes = require("./route/transactionRoutes");
const rewardRoutes = require("./route/rewardRoutes");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

app.get("/test", (req, res) => {
  res.send("Test working");
});

app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/rewards", rewardRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});