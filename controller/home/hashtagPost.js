const HashtagPost = require("../../model/HashtagPost");

// POST: '/api/hashtagPost'
exports.createHashtagPost = async (req, res) => {
  try {
    const {
      id,
      username,
      mediaUrl,
      postUrl,
      products,
      categoryId,
      categoryName,
    } = req.body;

    const hashtagPost = new HashtagPost({
      id,
      username,
      mediaUrl,
      postUrl,
      products,
      categoryId,
      categoryName,
    });

    await hashtagPost.save();
    res.status(201).json({ message: "Hashtag post added successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET: '/api/hastagPost'
exports.getHashtagPosts = async (req, res) => {
  try {
    const info = await HashtagPost.find().populate({
      path: "products",
      model: "products",
      localField: "products",
      foreignField: "patternNumber",
    });

    res.status(200).json(info);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET: '/api/hashtagPost/:id'
exports.getHashtagPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const info = await HashtagPost.findOne({ id: id }).populate({
      path: "products",
      model: "products",
      localField: "products",
      foreignField: "patternNumber",
    });

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: '/api/hashtagpost/:id'
exports.deleteHashtagPost = async (req, res) => {
  const { id } = req.params;

  try {
    await HashtagPost.findOneAndDelete({ id: id });
    res.status(200).json({ message: "Hashtag post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patch: '/api/hashtagPost/:id'
exports.updateHashtagPost = async (req, res) => {
  const { id } = req.params;
  const { products, categoryId, username } = req.body;

  try {
    await HashtagPost.findOneAndUpdate(
      { id: id },
      {
        products,
        username,
        category: categoryId,
      }
    );
    res.status(200).json({ message: "Hashtag post updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
