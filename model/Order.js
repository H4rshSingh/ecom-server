const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    isFreeSample: { type: Boolean, default: false },
    freeSampleCartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreeSampleCart",
    },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    payment: { type: Boolean, default: false },
    address: { type: addressSchema, required: true },
    amount: {
      deliveryPrice: Number,
      productPrice: Number,
      totalPrice: Number,
    },
  },
  { timestamps: true }
);

module.exports = CheckoutDB = mongoose.model("order", OrderSchema);
