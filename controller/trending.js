const categoriesDB = require("../model/Category");
const productsDB = require("../model/Products");
const {
  incrementPopularityUtil,
  // incrementCategoryPopularityUtil,
  // incrementSubCategoryPopularityUtil,
} = require("../utils/incrementPopularity");

// POST 'api/increment-popularity/:id'
exports.incrementPopularity = async (req, res) => {
  const { title } = req.query;
  console.log(req.query);
  try {
    await incrementPopularityUtil(title);
    res.json({ message: "Product popularity incremented successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.trendingProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const lastIndex = page * limit;
  try {
    const trendingProducts = await productsDB
      .find({ popularity: { $gt: 2 }, isAccessories: false })
      .sort({ popularity: -1 })
      .limit(5);
    let result = trendingProducts.slice(skip, lastIndex);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.incrementCategoryPopularity = async (req, res) => {
//   const { category } = req.query;
//   try {
//     await incrementCategoryPopularityUtil(category);
//     res.json({ message: "Category popularity incremented successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.incrementSubCategoryPopularity = async (req, res) => {
//   const { category, subCategory } = req.query;
//   console.log(req.query);
//   try {
//     await incrementSubCategoryPopularityUtil(category, subCategory);
//     res.json({ message: "subCategory popularity incremented successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.trendingSubCategories = async (req, res) => {
//   const { category } = req.query;
//   try {
//     const trendingSubCategories = await categoriesDB
//       .findOne({ name: category })
//       .select("subcategories")
//       // .sort({ popularity: 1 });
//     res.json(trendingSubCategories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.trendingCategories = async (req, res) => {
  try {
    const trendingCategories = await categoriesDB
      .find()
      .sort({ popularity: -1 });
    res.json(trendingCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.popularSearchProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const lastIndex = page * limit;
  try {
    const popularSearchProducts = await productsDB
      .find({ popularity: { $gt: 2 } })
      .sort({ popularity: -1 })
      .limit(5)
      .select("productTitle category subcategory");
    let result = popularSearchProducts.slice(skip, lastIndex);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
