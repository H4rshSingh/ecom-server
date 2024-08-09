const mongoose = require("mongoose");

// Define the schema
const suggestionSchema = new mongoose.Schema(
  {
    metadata: {
      type: {
        title: String,
      },
    },
    heading: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },

    shortSummary: {
      type: String,
      required: true,
    },
    mainImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
    },
    fiveGrid: {
      fiveGridHeader: {
        type: String,
      },
      fiveGridDescription: {
        type: String,
      },
      fiveGridRooms: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rooms",
        },
      ],
    },

    twoGrid: {
      twoGridHeader: {
        type: String,
      },
      twoGridDescription: {
        type: String,
      },
      twoGridRooms: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rooms",
        },
      ],
    },
    firstSlider: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    secondSlider: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    thirdSlider: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    forthSlider: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    fifthSlider: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],

    position: [
      {
        enum: [
          "heading",
          "mainImage",
          "twoGrid",
          "fiveGrid",
          "firstSlider",
          "secondSlider",
          "thirdSlider",
          "forthSlider",
          "fifthSlider",
        ],
        type: String,
        required: true,
      },
    ],

  },
  {
    timestamps: true,
  }
);

// Create the model
const Suggestion = mongoose.model("Suggestions", suggestionSchema);

module.exports = Suggestion;
