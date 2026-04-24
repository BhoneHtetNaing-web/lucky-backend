const stripe = require('../../config/stripe');

const axios = require("axios");

const createKBZPayPayment = async ({ amount, orderId }) => {
    try {
        const response = await axios.post(
            "https://api.kbzpay.com/payment/create",
            {
                amount,
                orderId,
                curreny: "MMK",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.KBZPAY_TOKEN}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw new Error("KBZPay Error");
    }
};

const createWavePayPayment = async ({ amount, orderId }) => {
    try {
        const response = await axios.post(
            "https://api.wavepay.com/payment/create",
            {
                amount,
                orderId,
            }
        );

        return response.data;
    } catch (err) {
        throw new Error("WavePay Error");
    }
};

const createCheckoutSession = async (booking) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Flight Booking #${booking.id}`,
                    },
                    unit_amount: booking.total_price * 100,
                },
                quantity: 1,
            },
        ],

        success_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/failed`,

        metadata: {
            booking_id: booking.id,
            session_id: session.id
        },
    });

    return session;
};

module.exports = { createKBZPayPayment, createWavePayPayment, createCheckoutSession };