const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ],
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
