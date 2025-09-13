const stripe = require("../Config/stripe");
const BookingModel = require("../Models/BookingModel");
const FlightModel = require("../Models/FlightModel");
const PaymentModel = require("../Models/PaymentModel");

module.exports = {

    async paymentCancel(req,res)
    {

    },
    async createCheckoutSession(req, res) {
    try {
    const { bookingId } = req.body;
    const userId = req.user && req.user._id;

    const booking = await BookingModel.findBookingById(bookingId);

    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "غير مسموح لك بالدفع لحجز مش بتاعك" });
    }

    if (booking.status === "confirmed") {
        return res.status(400).json({ error: "الحجز مؤكد بالفعل وتم الدفع" });
    }

    const flight = await FlightModel.findFlightById(booking.flightId);

    if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
    }

    const amount = Math.round((flight.price || 0) * 100);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
        {
            price_data: {
            currency: "usd",
            product_data: { name: `Flight ${flight.flightNumber}` },
            unit_amount: amount,
            },
            quantity: 1,
        },
        ],
        mode: "payment",
        metadata: {
        flightId: flight._id.toString(),
        bookingId: booking._id.toString(),
        userId: userId.toString(),
        },
        success_url: `${process.env.BASE_URL}/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/payment/payment-cancel`,
    });

    res.json({ url: session.url });

    } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "خطأ في إنشاء جلسة الدفع" });
    }
}
,
    async  getAllPayments(req, res) {
        try {
        const payments = await PaymentModel.findAll();
        res.json(payments);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
    },
}
