const { ObjectId } = require("mongodb");
const connectDB = require("../Config/db.js");

async function createBooking(booking) {
    const db = await connectDB();
    const flight = await db.collection("flights").findOne({ _id: new ObjectId(booking.flightId) });
    if (!flight) {
    throw new Error("Flight not found"); 
    }
    booking.bookingDate = new Date();
    booking.status = "pending"; 
    return db.collection("bookings").insertOne(booking);
}

async function updateBookingStatus(userId, flightId, status) {
    const db = await connectDB();
    return db.collection("bookings").updateOne(
        {
            userId: userId,
            flightId: flightId
        },
        {
            $set: { status: status }
        }
    );
}

async function findUserBookings(userId) {
    const db = await connectDB();
    return db.collection("bookings").aggregate([
        { $match: { userId: userId } },  
        {
            $addFields: {
                flightIdObj: { $toObjectId: "$flightId" }
            }
        },
        {
            $lookup: {
                from: "flights",          
                localField: "flightIdObj",  
                foreignField: "_id",    
                as: "flight"
            }
        },
        { $unwind: "$flight" }
    ]).toArray();
}

async function cancelBooking(id) {
    const db = await connectDB();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
    throw new Error("Booking not found"); 
    }
    return db.collection("bookings").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "cancelled", updatedAt: new Date() } }
    );
}

async function findBookingById(bookingid) {
    const db = await connectDB();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingid) });
    if (!booking) {
    throw new Error("Booking not found"); 
    }
    return booking;
}

async function findAll() {
    const db = await connectDB();
    return db.collection("bookings").find().toArray();
}
module.exports = { createBooking, findUserBookings, cancelBooking , findBookingById ,findAll , updateBookingStatus};
