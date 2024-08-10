const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const camps = await Campground.find({});
  res.json(camps);
};

module.exports.createCampground = async (req, res) => {
  req.files.map((f) => ({ url: f.path, filename: f.filename }));
  req.body.position = JSON.parse(req.body.position);
  const campground = new Campground(req.body);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  campground.rating = 0;
  campground.favorites = 0;
  campground.visits = 0;
  await campground.save();
  res.json(campground);
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const updatedCamp = await Campground.findByIdAndUpdate(id, req.body);
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  updatedCamp.images.push(...imgs);
  await updatedCamp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  res.json(updatedCamp);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.body;
  const foundCamp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", model: "User" },
    })
    .populate("author");
  if (!foundCamp) {
    return res.status(403).json({ error: "Campground not found" });
  }
  res.json(foundCamp);
};
