const mongoose = require("mongoose");

const HashtagPostSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: String,
  mediaUrl: {
    type: String,
    required: true,
  },
  postUrl: {
    type: String,
    required: true,
  },
  products: [
    {
      type: String,
      ref: "products",
    },
  ],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  categoryName: {
    type: String,
  },
});

module.exports = mongoose.model("HashtagPost", HashtagPostSchema);
