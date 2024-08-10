const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "author",
      model: "User",
    },
  });
  if (!campground) {
    return res.status(404).json({ error: "Campground not found " });
  }
  res.json(campground.reviews);
};

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate(
    "reviews"
  );
  const review = new Review({
    body: req.body.body,
    rating: req.body.rating,
  });
  review.author = req.user._id;
  campground.reviews.push(review);
  const campRating =
    campground.reviews.reduce((acc, r) => acc + r.rating, 0) /
    campground.reviews.length;
  campground.rating = Math.round(campRating * 100) / 100;
  await review.save();
  await campground.save();
  res.json(review);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
};
