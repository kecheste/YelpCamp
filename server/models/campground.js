const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  title: String,
  description: String,
  location: String,
  rating: Number,
  favorites: Number,
  visits: Number,
  images: [ImageSchema],
  position: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  price: Number,
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
