const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  // {
  //   metadata: {
  //     type: {
  //       title: String,
  //     },
  //   },
  //   // roomType: { type: String, required: true },
  //   mainImage: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "rooms",
  //   },
  //   title: { type: String, required: true },
  //   description: { type: String, required: true },
  //   fiveGridHeader: { type: String },
  //   fiveGridDescription: { type: String },
  //   twoGridHeader: { type: String },
  //   twoGridDescription: { type: String },
  //   twoGridRooms: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "rooms",
  //     },
  //   ],
  //   details: [
  //     {
  //       heading: String,
  //       description: String,
  //     },
  //   ],
  //   fiveRooms: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "rooms",
  //     },
  //   ],
  //   firstSlider: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "products",
  //     },
  //   ],
  //   secondSlider: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "products",
  //     },
  //   ],
  //   thirdSlider: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "products",
  //     },
  //   ],

  //   children: [
  //     {
  //       productTitle: String,
  //       productCategory: String,
  //       price: Number,
  //       topPosition: Number,
  //       leftPosition: Number,
  //       productLink: String,
  //     },
  //   ],
  // },
  {
    metadata: {
      type: {
        title: String,
      },
    },
    roomType: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    heading: {
      type: String,
      required: true,
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
  { versionKey: false, timestamps: true }
);

const RoomMain = mongoose.model("roomMain", roomSchema);

module.exports = RoomMain;
