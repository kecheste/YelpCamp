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
        user: registeredUser,
      });
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.send({ message: "Failed to Authenticate", success: false });
    }
    if (!user) {
      return res.send({ message: "Authentication Failed", success: false });
    }
    req.login(user, (err) => {
      if (err) {
        return res.send({ message: "An error occurred", success: false });
      }
      return res.send({
        message: "User logged in",
        success: true,
        user: user,
      });
    });
  })(req, res, next);
};

module.exports.getUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("User authenticated: ", req.user);
    return res.json({ user: req.user });
  } else {
    console.log("No user authenticated");
    return res.json({ user: null }).status(403);
  }
};

module.exports.getAllFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
};

module.exports.getMyCampgrounds = async (req, res) => {
  const user = await User.findById(req.user._id).populate("campgrounds");
  res.json(user.campgrounds);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.send({ message: "Failed to logout", success: false });
    }
    return res.send({ message: "User logged out", success: true });
  });
};
