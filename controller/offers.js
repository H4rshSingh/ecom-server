const offerDb = require("../model/Offers");
const productDb = require("../model/Products");
const categoryDb = require("../model/Category");

exports.createOffer = async (req, res) => {
  try {
    const {
      type,
      percentageOff,
      endDate,
      startDate,
      description,
      metadataTitle,
      chunkSize,
    } = req.body;
    const offer = await offerDb.findOne({
      type: type,
    });
    if (offer) {
      return res.status(400).json({ message: "Offer already exists." });
    }

    const newOffer = new offerDb({
      type,
      percentageOff,
      startDate,
      endDate,
      description,
      metadata: {
        title: metadataTitle,
      },
      chunkSize,
    });

    console.log({ newOffer });

    await newOffer.save();

    res.status(201).json({ message: "Offer created successfully.", newOffer });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.addProductToOffer = async (req, res) => {
  try {
    const { type, productId } = req.body;
    const offer = await offerDb.findOne({
      type: type,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    const product = await productDb.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.discountedprice.price =
      product.perUnitPrice - (product.perUnitPrice * offer.percentageOff) / 100;

    product.discountedprice.startDate = offer.startDate;
    product.discountedprice.endDate = offer.endDate;
    product.discountedprice.chunkSize = offer.chunkSize;
    product.offer = type;

    await product.save();
    res.status(200).json({ message: "Product added to Offer." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getOffer = async (req, res) => {
  const { type } = req.query;

  try {
    const offer = await offerDb.findOne({
      type: (type?.replace(/%20/g, " ") || "").trim(),
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    res.status(200).send(offer);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// exports.getAllProductsByOffer = async (req, res) => {
//   try {
//     const { type } = req.params;
//     if (!type) return res.status(400).json({ message: "Please provide type." });

//     const offer = await offerDb.findOne({
//       type: { $regex: new RegExp(type, "i") },
//     });
//     if (!offer) {
//       return res.status(404).json({ message: "Offer not found." });
//     }

//     const products = await productDb.find({
//       offer: { $regex: new RegExp(type, "i") },
//     });
//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message || "Internal server error" });
//   }
// };

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await offerDb.find();
    res.status(200).send(offers);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.removeProductFromOffer = async (req, res) => {
  try {
    const { type, productId } = req.body;
    const offer = await offerDb.findOne({
      type: { $regex: new RegExp(type, "i") },
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    const product = await productDb.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.discountedprice = null;
    product.offer = null;
    await product.save();
    res.status(200).json({ message: "Product removed from Offer." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { type } = req.params;
    const offer = await offerDb.findOne({
      type,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    const product = await productDb.find({
      offer: type,
    });
    product.forEach(async (product) => {
      product.discountedprice = null;
      product.offer = null;
      await product.save();
    });

    await offer.deleteOne();
    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getAllCategoryByOffer = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) return res.status(400).json({ message: "Please provide type." });
    const offer = await offerDb.findOne({
      type,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    const products = await productDb.find({
      offer: type,
    });
    const categories = products.map((product) => product.category);
    const uniqueCategories = [...new Set(categories)];
    let category = [];

    for (let i = 0; i < uniqueCategories.length; i++) {
      const categoryData = await categoryDb
        .findOne({
          name: uniqueCategories[i],
        })
        .select("name image");
      category.push(categoryData);
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
