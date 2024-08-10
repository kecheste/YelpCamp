const { campSchema, reviewSchema } = require("./schemas");
const AppError = require("./utils/AppError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.json(req.user);
  }
  next();
};

module.exports.isAuth = (req, res, next) => {
  if (req.user) next();
  res.json({ loggedIn: false });
};

module.exports.validateInput = (req, res, next) => {
  const filteredBody = {};

  for (const key in req.body) {
    if (key !== "position") {
      filteredBody[key] = req.body[key];
    }
    filteredBody["position"] = JSON.parse(req.body.position);
  }
  console.log(filteredBody);
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
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    return res
      .status(403)
      .json({ error: "You do not have permission to do that" });
  }
  next();
};
