const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateInput, isAuthor, isAuth } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isAuth,
    upload.array("image"),
    validateInput,
    catchAsync(campgrounds.createCampground)
  );

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .patch(
    isAuth,
    isAuthor,
    // upload.array("image"),
    validateInput,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isAuth, isAuthor, catchAsync(campgrounds.deleteCampground));

router
  .route("/:id/favorite")
  .post(isAuth, catchAsync(campgrounds.addFavoriteCampground));

module.exports = router;
