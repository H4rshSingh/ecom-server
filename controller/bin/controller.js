const { default: mongoose } = require("mongoose");
const categoriesDB = require("../../model/Category");
const citiesAndHobbiesDB = require("../../model/CityHobbie");
const Product = require("../../model/Products");
const roomsDB = require("../../model/room");
// GET: api/categories
exports.getCategories = async (req, res) => {
  try {
    const allCategoriesData = await categoriesDB.find();

    // Check if there are no categories found
    if (!allCategoriesData || allCategoriesData.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    res.status(200).send(allCategoriesData);
  } catch (error) {
    res
      .status(500)
      .json({ err: error.message || "Error while getting categories!" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const image = req.files.image;
    const imageUrl = image[0].location;
    const subCategoriesImage = req.files.subCategoriesImage?.filter(
      (file) => file.fieldname === "subCategoriesImage"
    );
    const subCategoriesImageUrl = subCategoriesImage?.map(
      (file) => file.location
    );
    // const maintenanceDetails = req.files.maintenanceDetails[0]?.location;
    // const certification = req.files.certification[0]?.location;

    const firstImage = req.files.firstImage;
    const secondImage = req.files.secondImage;

    const {
      name,
      description,
      subcategories,
      type,
      metadataTitle,
      showCalculator,
      maintenanceDetails,
      installationDetails,
      firstGrid,
      secondGrid,
    } = req.body;

    let availableColors = req.body.availableColors;
    let availableServices = req.body.availableServices;
    let availableRatingTypes = req.body.availableRatingTypes;

    if (typeof availableColors === "string") {
      availableColors = JSON.parse(availableColors);
    }
    if (typeof availableServices === "string") {
      availableServices = JSON.parse(availableServices);
    }

    if (typeof availableRatingTypes === "string") {
      availableRatingTypes = JSON.parse(availableRatingTypes);
    }

    // console.log("Avaliable Services", availableServices)
    // console.log("Avaliable Services", availableServices)

    const mappedSubCategories = subcategories?.map((subCategory, index) => ({
      name: subCategory.name,
      img: subCategoriesImageUrl[index],
      description: subCategory.description,
      metadata: { title: subCategory.metadataTitle },
      isAccessories: subCategory.isAccessories,
      // isFreeShippingAvailable: subCategory.isFreeShippingAvailable,
      // isOnlySoldInStore: subCategory.isOnlySoldInStore,
      // isFreeSampleAvailable: subCategory.isFreeSampleAvailable,
      // expectedDelivery: subCategory.expectedDelivery,
    }));

    let mappedFirstGrid = null;
    if (firstGrid) {
      mappedFirstGrid = {
        title: firstGrid.title || null,
        description: firstGrid.description || null,
        link: firstGrid.link || null,
        image: firstImage ? firstImage[0].location : null,
      };
    }

    let mappedSecondGrid = null;
    if (secondGrid) {
      mappedSecondGrid = {
        title: secondGrid.title || null,
        description: secondGrid.description || null,
        link: secondGrid.link || null,
        image: secondImage ? secondImage[0].location : null,
      };
    }

    const existingCategory = await categoriesDB.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const newCategory = new categoriesDB({
      name,
      image: imageUrl,
      subcategories: mappedSubCategories,
      type,
      description,
      maintenanceDetails,
      installationDetails,
      // certification,
      availableColors,
      availableServices,
      availableRatingTypes,
      showCalculator,
      firstGrid: mappedFirstGrid,
      secondGrid: mappedSecondGrid,
      metadata: { title: metadataTitle },
    });

    // Save the new category to the database
    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category added successfully.", category: newCategory });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getCategoryByName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await categoriesDB.findOne({
      name: categoryName,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.updateCategoryMetadata = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { metadataTitle } = req.body;

    const category = await categoriesDB.findOneAndUpdate(
      { name: { $regex: new RegExp(categoryName, "i") } },
      { metadata: { title: metadataTitle } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res
      .status(200)
      .json({ message: "Category metadata updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const categories = await categoriesDB.find({
      type: { $regex: new RegExp(type, "i") },
    });

    if (!categories) {
      return res.status(404).json({ message: "Categories not found." });
    }

    // sort subcategories by popularity

    categories.forEach((category) => {
      category.subcategories.sort((a, b) => b.popularity - a.popularity);
    });

    res.status(200).send(categories);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await categoriesDB.findOne({
      name: categoryName,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).send(category.subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// GET: api/citiesAndHobbies
exports.getCitiesAndHobbies = async (req, res) => {
  try {
    const citiesAndHobbie = await citiesAndHobbiesDB.find();

    // Check if there are no categories found
    if (!citiesAndHobbie || citiesAndHobbie.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    res.status(200).send(citiesAndHobbie);
  } catch (error) {
    res.status(500).json({
      err: error.message || "Error while getting cities and hobbies!",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await categoriesDB.findOneAndDelete({
      name: categoryName,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    // find all products with the same category and delete them
    await Product.deleteMany({ category: categoryName });
    await roomsDB.deleteMany({ productCategory: categoryName });

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.DeleteSubCategory = async (req, res) => {
  const { categoryId, subcategoryId } = req.params;
  try {
    const category = await categoriesDB.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    category.subcategories.pull({ _id: subcategoryId });
    await category.save();
    await Product.deleteMany({ subcategory: subcategory.name });

    res.status(200).json({ message: "Deleted subcategory successfully" });
  } catch (err) {
    console.error("Error details:", JSON.stringify(err, null, 2));
    res.status(400).send({ error: err.message });
  }
};

exports.CreateSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, metadataTitle, isAccessories } = req.body;
    console.log(req.body);
    const image = req.files.image;
    if (!image || image.length === 0) {
      return res.status(400).json({ message: "Image is required" });
    }
    const imageUrl = image[0].location;
    const category = await categoriesDB.findById(categoryId);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    const newSubcategory = {
      name,
      img: imageUrl,
      description,
      metadata: { title: metadataTitle },
      isAccessories,
      _id: new mongoose.Types.ObjectId(),
    };
    category.subcategories.push(newSubcategory);
    await category.save();
    res
      .status(201)
      .json({ newSubcategory, message: "created subCategory successfully" });
  } catch (err) {
    console.error("Error saving subcategory:", err);
    res.status(400).send(err);
  }
};

// exports.EditSubCategory = async (req, res) => {
//   const { categoryId, subcategoryId } = req.params;
//   const { name, img } = req.body;

//   try {
//     const category = await categoriesDB.findById(categoryId);
//     const subcategory = category.subcategories.id(subcategoryId);

//     if (name) subcategory.name = name;
//     if (img) subcategory.img = img;

//     await category.save();
//     res.status(200).json({ message: "Edited subCategory successfully" });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// }

exports.getSubCategoryDetailByCategoryAndSubCategoryName = async (req, res) => {
  const { categoryName, subCategoryName } = req.query;
  try {
    const category = await categoriesDB
      .findOne({ name: categoryName })
      .select("subcategories");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = category.subcategories.find(
      (subCategory) => subCategory.name === subCategoryName
    );

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).send(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getallProductsBySubCategory = async (req, res) => {
  const { categoryName, subCategoryName } = req.query;

  // console.log(categoryName, subCategoryName)
  try {
    // Find all products by category
    const products = await Product.find({ category: categoryName });

    // Filter products by subcategory
    const filteredProducts = products.filter((product) =>
      product.subcategory.includes(subCategoryName)
    );

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.updateCategoryFirstGrid = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const firstImage = req.files.firstImage;

    const { firstGrid } = req.body;

    const mappedFirstGrid = {
      title: firstGrid.title || null,
      description: firstGrid.description || null,
      link: firstGrid.link || null,
      image: firstImage ? firstImage[0].location : null,
    };
    const category = await categoriesDB.findByIdAndUpdate(
      categoryId,
      { firstGrid: mappedFirstGrid },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res
      .status(200)
      .json({ message: "Category First grid updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

exports.updateCategorySecondGrid = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const secondImage = req.files.secondImage;

    const { secondGrid } = req.body;

    const mappedSecondGrid = {
      title: secondGrid.title || null,
      description: secondGrid.description || null,
      link: secondGrid.link || null,
      image: secondImage ? secondImage[0].location : null,
    };
    const category = await categoriesDB.findByIdAndUpdate(
      categoryId,
      { secondGrid: mappedSecondGrid },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res
      .status(200)
      .json({ message: "Category second grid updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

exports.deleteCategoryFirstGrid = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoriesDB.findByIdAndUpdate(
      categoryId,
      { firstGrid: null },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category grid removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};
exports.deleteCategorySecondGrid = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoriesDB.findByIdAndUpdate(
      categoryId,
      { secondGrid: null },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category grid removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};
