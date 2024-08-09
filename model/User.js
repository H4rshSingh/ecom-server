const mongoose = require("mongoose");

const liveStreamDetailsSchema = new mongoose.Schema({
  isLiveStreamHost: { type: Boolean, default: false },
  topic: String,
});

const userSchema = new mongoose.Schema(
  {
    deviceId: String,
    pincode: Number,
    googleId: { type: String },
    displayName: String,
    email: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://ayatrio-bucket.s3.ap-south-1.amazonaws.com/1723199523485_image_user.png",
    },
    liveStreamDetails: liveStreamDetailsSchema,
    userType: {
      type: String,
      default: "user",
      enum: ["user", "author"],
    },
    password: {
      type: String,
    },
    authorDetails: {
      description: {
        type: String,
      },
      award: {
        type: String,
      },
      experience: {
        type: String,
      },
    },
    role: {
      type: String,
    },
    emailSent: { type: Boolean, default: false }, // Add emailSent field with default value false
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    links: {
      linkedin: String,
      instagram: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

const userdb = mongoose.model("users", userSchema);

module.exports = userdb;
