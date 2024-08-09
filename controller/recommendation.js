const preferencesDB = require("../model/Preferences");
const productsDB = require("../model/Products");

exports.preferences = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Please provide category data" });
    }

    const { deviceId, userPreferredCategories } = req.body;

    if (!deviceId || !userPreferredCategories) {
      return res.status(400).json({ error: "Fill in all the required fields" });
    }

    const subcategoriesArray = combineSubcategories(userPreferredCategories);

    const existingPreference = await preferencesDB.findOne({ deviceId });

    if (existingPreference) {
      const recommendedProducts = await productsDB.find({
        subcategory: {
          $in: subcategoriesArray.map((sub) => new RegExp(sub, "i")),
        },
      });

      const uniqueNewRecommendations = recommendedProducts.map(product => product._id.toString());

      existingPreference.recommendedProducts = existingPreference.recommendedProducts.filter(
        productId => !uniqueNewRecommendations.includes(productId.toString())
      );

      if (recommendedProducts.length > 0) {
        existingPreference.recommendedProducts = [
          ...uniqueNewRecommendations,
          ...existingPreference.recommendedProducts.map(id => id.toString())
        ];
      }

      await existingPreference.save();

      return res
        .status(200)
        .json({ message: "Preferences updated successfully..!" });
    }
    else {

      const newPreference = new preferencesDB({
        deviceId,
        recommendedProducts: [],
      });

      // Send recommendations
      const recommendedProducts = await productsDB.find({
        subcategory: {
          $in: subcategoriesArray.map((sub) => new RegExp(sub, "i")),
        },
      });

      // Filter only product Id to store in DB
      newPreference.recommendedProducts = recommendedProducts.map(
        (product) => product._id
      );

      // Save new preferences in DB
      await newPreference.save();

      return res
        .status(201)
        .json({ message: "Preferences stored successfully..!" });
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error while saving user preferences",
      details: error.message,
    });
  }
};

// ---------------------------------

function combineSubcategories(categories) {
  let combinedSubcategories = [];

  categories.forEach((category) => {
    if (category.subcategories && Array.isArray(category.subcategories)) {
      combinedSubcategories = combinedSubcategories.concat(
        category.subcategories
      );
    }
  });

  return combinedSubcategories;
}

// GET: api/getRecommendation
exports.getRecommendation = async (req, res) => {
  try {
    const deviceId = req.query.deviceId;

    let recommendations = await preferencesDB.findOne({ deviceId }, { recommendedProducts: 1 })
      .populate({
        path: 'recommendedProducts',
        select: '',
      })
      .exec();

    const allProducts = await productsDB.find({ popularity: { $gt: 2 } }).sort({ popularity: -1 });

    if (recommendations && recommendations.recommendedProducts.length > 0) {
      const recommendedProducts = recommendations.recommendedProducts.map(product => product.id);

      const filteredAllProducts = allProducts.filter(product => {
        return !recommendedProducts.includes(product.id);
      });

      const mergedProducts = [...recommendations.recommendedProducts, ...filteredAllProducts];

      const sortedProducts = mergedProducts.sort((a, b) => b.popularity - a.popularity);

      return res.json({ recommendations: { recommendedProducts: sortedProducts } });
    }

    return res.json({ recommendations: { recommendedProducts: allProducts } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
