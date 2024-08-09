const mongoose = require("mongoose");

const bannerSectionSchema = new mongoose.Schema({
  // img: { type: String, required: true },
  text: { type: String },
  mainHeading: { type: String },
  description: { type: String },
  // buttonText: { type: String, required: true },
  // link: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
});

const bannerSectionDB = mongoose.model("bannerSectionImg", bannerSectionSchema);

module.exports = bannerSectionDB;
