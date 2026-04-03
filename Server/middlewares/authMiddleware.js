const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";

const protect = async (req, res, next) => {
  let token;

  // 🔥 check token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // get token
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, jwtSecret);

      // get user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // go to next function

    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;