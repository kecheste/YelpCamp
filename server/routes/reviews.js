const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isReviewAuthor, isAuth } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isAuth, validateReview, catchAsync(reviews.createReview));

router.get("/", catchAsync(reviews.index));

router.delete(
  "/:reviewId",
  isAuth,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
