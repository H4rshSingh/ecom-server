const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
    {
        productTitle: String,
        productCategory: String,
        price: Number,
        topPosition: Number,
        leftPosition: Number,
        productLink: String
    },
    { versionKey: false, timestamps: true }
);
const roomSchema = new mongoose.Schema({
    imgSrc: String,
    children: [childSchema], // Embedding child documents,
    roomType: { type: String, required: true },
    productId: { type: String, required: true },
    productObjectId: { type: mongoose.Schema.ObjectId, ref: "products", required: true },
    productCategory: { type: String, required: true },
}, { versionKey: false, timestamps: true });

// const Room = mongoose.model("rooms", roomSchema);
const Room = mongoose.models.rooms || mongoose.model("rooms", roomSchema);

module.exports = Room;