const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  metadata: {
    type: {
      title: String,
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  isAccessories: {
    type: Boolean,
    default: false,
  },
});

const categorySchema = new mongoose.Schema({
  metadata: {
    type: {
      title: String,
    },
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  subcategories: {
    type: [subcategorySchema],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  maintenanceDetails: [
    {
      heading: { type: String },
      description: { type: String },
    },
  ],
  installationDetails: [
    {
      heading: { type: String },
      description: { type: String },
    },
  ],
  // certification: {
  //   type: String,
  // },
  availableColors: {
    type: [{ name: String, hexCode: String }],
  },
  availableServices: {
    type: [{ name: String, cost: Number, unitType: String }],
  },
  specialRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rooms",
  },
  availableRatingTypes: {
    type: [{ name: String, image: String }],
  },
  showCalculator: {
    type: Boolean,
    default: false,
  },
  firstGrid: {
    title: { type: String },
    description: { type: String },
    link: { type: String },
    image: { type: String },
  },
  secondGrid: {
    title: { type: String },
    description: { type: String },
    link: { type: String },
    image: { type: String },
  },
});

const categoriesDB = mongoose.model("ProductCategories", categorySchema);

module.exports = categoriesDB;
