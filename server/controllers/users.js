const User = require("../models/user");
const userService = require("../services/signUp");
const authService = require("../services/logIn");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwtUtils");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (username.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 6 characters",
      });
    }

    if (email.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Email must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const user = await userService.createUser({
      email,
      username,
      password,
      salt,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authService.logInUser(username, password);
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "None",
      // domain: "https://yelp-camp-kohl.vercel.app",
      // sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
};

module.exports.getUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "User not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    try {
      const user = await User.findById(decoded._id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

module.exports.getAllFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch favorites" });
  }
};

module.exports.getMyCampgrounds = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("campgrounds");
    res.status(200).json({ success: true, campgrounds: user.campgrounds });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch campgrounds" });
  }
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "User logged out" });
};
