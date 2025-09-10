const paymentController = require("../Controllers/PaymentController");
const authMiddleware = require("../Middleware/authMiddleware");
const PaymentModel = require("../Models/PaymentModel");
const userModel = require("../Models/UserModel");
const flightModel = require("../Models/FlightModel");
const bookingModel = require("../Models/BookingModel");
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const isAdmin = require("../Middleware/roleMiddleware");
const { sendEmail } = require("../Config/nodemailer");

router.post("/checkout", authMiddleware, paymentController.createCheckoutSession);

router.get("/payment-success", async (req, res) => {
        try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const paymentData = {
            userId: session.metadata.userId,
            flightId: session.metadata.flightId,
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: session.payment_status,
            sessionId: session.id,
            createdAt: new Date()
        };

        const result = await PaymentModel.createPayment(paymentData);

        const user = await userModel.findById(session.metadata.userId);
        const flight = await flightModel.findFlightById(session.metadata.flightId);
        await bookingModel.updateBookingStatus(session.metadata.userId,session.metadata.flightId,"confirmed")
        await sendEmail(
            user.email,
            "Payment & Booking Confirmation",
            `
                <h2>تم الدفع والحجز بنجاح </h2>
                <p>رحلة: ${flight.flightNumber}</p>
                <p>موعد الإقلاع: ${flight.departureTime}</p>
                <p>المبلغ المدفوع: ${paymentData.amount} ${paymentData.currency.toUpperCase()}</p>
            `
        );

        res.json({
            message: "Payment successful, saved to DB, and email sent",
            payment: result
        });
        } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/payment-cancel", (req, res) => {
res.json({ message: "Payment canceled by user" });
});

router.get("/allpayments",authMiddleware,isAdmin,paymentController.getAllPayments);

module.exports = router;

