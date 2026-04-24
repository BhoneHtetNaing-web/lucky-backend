const axios = require("axios");
const crypto = require("crypto");

const KBZ_URL = "https://api.kbzpay.com/payment";

exports.createKBZPayment = async (order) => {
  const payload = {
    merchant_id: process.env.KBZ_MERCHANT_ID,
    order_id: order.id,
    amount: order.amount,
    currency: "MMK",
    callback_url: "https://lucky-backend-production-4109.up.railway.app/api/payments/callback",
  };

  // 🔐 Sign (important)
  const signature = crypto
    .createHmac("sha256", process.env.KBZ_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");

  const res = await axios.post(KBZ_URL, payload, {
    headers: {
      "X-Signature": signature,
    },
  });

  return res.data;
};