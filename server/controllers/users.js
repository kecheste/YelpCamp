const passport = require("passport");
const User = require("../models/user");

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

    if (username.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 4 characters",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("Error 1");
      return res
        .status(500)
        .json({ success: false, message: "Failed to authenticate" });
    }
    if (!user) {
      console.log("No user");
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
    req.login(user, (err) => {
      if (err) {
        console.log("Login error");
        return res
          .status(500)
          .json({ success: false, message: "An error occurred" });
      }
      console.log("Logging ing");
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

module.exports.getUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }
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
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to logout" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to destroy session" });
      }
      res.clearCookie("session"); // Clear session cookie on logout
      return res
        .status(200)
        .json({ success: true, message: "User logged out" });
    });
  });
};
