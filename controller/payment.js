const { default: axios } = require("axios");
const { SHA256 } = require("crypto-js");
const Order = require("../model/Order");
const {
  sendOrderConfirmationEmail,
  sendFreeSampleRequestEmail,
} = require("./sendmail");
const CartDB = require("../model/Cart");
const FreeSampleCart = require("../model/FreeSampleCart");

exports.makePayment = async (req, res) => {
  try {
    const { amount, callbackUrl, redirectUrl } = req.body;
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const merchantKey = process.env.PHONEPE_MERCHANT_KEY;
    const keyIndex = process.env.PHONEPE_KEY_INDEX;
    const baseUrl = process.env.PHONEPE_BASE_URL;
    const payEndpoint = process.env.PHONEPE_PAY_ENDPOINT;

    const transactionId = crypto.randomUUID();

    const payload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: "MUID123",
      amount: +amount,
      redirectUrl: redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      redirectMode: "POST",
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    const fullUrl = encodedPayload + payEndpoint + merchantKey;

    const checksum = SHA256(fullUrl) + "###" + keyIndex;

    const response = await axios.request({
      method: "POST",
      url: `${baseUrl}${payEndpoint}`,
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: encodedPayload,
      },
    });

    res.status(200).json({ data: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.payment = true;

    await order.save();

    const isFreeSample = order.isFreeSample;
    if (isFreeSample) {
      const freeSampleCartProducts = await FreeSampleCart.findById(
        order.freeSampleCartId
      )
        .populate({
          path: "products",
          select:
            "productDescription productTitle  images specialprice discountedprice perUnitPrice ",
        })
        .select("products");

      const products = freeSampleCartProducts.products.map((item) => {
        const price =
          item.specialprice.price?.price || item.discountedprice?.price || item.perUnitPrice;
        return {
          productTitle: item.productTitle,
          productDescription: item.productDescription,
          images: item.images,
          price: price,
        };
      });
      await sendFreeSampleRequestEmail(order, products);
    } else {
      const cartProducts = await CartDB.findById(order.cartId)
        .populate({
          path: "items.productId",
          select:
            "productDescription productTitle  images specialprice discountedprice perUnitPrice ",
        })
        .select("items.productId");

      const products = cartProducts.items.map((item) => {
        const price =
          item.productId.specialprice.price ||
          item.productId.discountedprice.price ||
          item.productId.perUnitPrice;
        return {
          productTitle: item.productId.productTitle,
          productDescription: item.productId.productDescription,
          images: item.productId.images,
          price: price,
        };
      });

      await sendOrderConfirmationEmail(order, products);
    }

    return res
      .status(200)
      .json({ message: "Payment successful", isFreeSample });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
