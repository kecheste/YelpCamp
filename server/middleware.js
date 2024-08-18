const { campSchema, reviewSchema } = require("./schemas");
const AppError = require("./utils/AppError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

module.exports.validateInput = (req, res, next) => {
  const filteredBody = {};

  for (const key in req.body) {
    if (key !== "position") {
      filteredBody[key] = req.body[key];
    }
    filteredBody["position"] = JSON.parse(req.body.position);
  }
  const { error } = campSchema.validate(filteredBody);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    return res.json(campground);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  if (!review.author.equals(req.user._id)) {
    return res
      .status(403)
      .json({ error: "You do not have permission to do that" });
  }
  next();
};

module.exports.isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(203).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  });
};
