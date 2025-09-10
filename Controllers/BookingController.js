const BookingModel = require("../Models/BookingModel");


module.exports = {
    async createBooking(req, res) {
    try {
    const booking = {
        userId: req.user._id,
        flightId: req.body.flightId,
        numberOfSeats: req.body.numberOfSeats
    };

    const result = await BookingModel.createBooking(booking);

    res.status(201).json(result);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},
async getMyBookings(req, res) {
    try {
        const bookings = await BookingModel.findUserBookings(req.user._id);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },

    async cancelBooking(req, res) {
    try {
        const bookingId = req.params.id;
        const result = await BookingModel.cancelBooking(bookingId);

        if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Booking not found or already cancelled" });
        }

        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    },
    async  getAllBookings(req, res) {
        try {
        const bookings = await BookingModel.findAll();
        res.json(bookings);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
    },


}