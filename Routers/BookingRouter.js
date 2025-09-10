const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/BookingController");
const authMiddleware = require("../Middleware/authMiddleware");
const isAdmin = require("../Middleware/roleMiddleware");

router.post("/createbooking", authMiddleware, bookingController.createBooking);

router.get("/allmybooking", authMiddleware, bookingController.getMyBookings);

router.put("/cancelmybooking/:id", authMiddleware, bookingController.cancelBooking);

router.get("/allbookings",authMiddleware,isAdmin,bookingController.getAllBookings);

module.exports = router;
