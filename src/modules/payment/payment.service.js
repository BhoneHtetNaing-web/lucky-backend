const stripe = require('../../config/stripe');

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

module.exports = { createCheckoutSession };