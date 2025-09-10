const connectDB = require("../Config/db.js");
const { ObjectId } = require("mongodb");

async function createFlight(flight) {
    const db = await connectDB();
    return db.collection("flights").insertOne(flight);
}


async function findAllFlights() {
    const db = await connectDB();
    return db.collection("flights").find().toArray();
}

async function findFlightById(id) {
    const db = await connectDB();
    const flight = await db.collection("flights").findOne({ _id: new ObjectId(id) });
    if (!flight) {
    throw new Error("Flight not found"); 
    }
    return db.collection("flights").findOne({ _id: new ObjectId(id) });
}

async function updateFlight(id, data) {
    const db = await connectDB();
    const flight = await db.collection("flights").findOne({ _id: new ObjectId(booking.flightId) });
    if (!flight) {
    throw new Error("Flight not found"); 
    }

    if (!ObjectId.isValid(id)) return null;
    data.updatedAt = new Date();
    return db.collection("flights").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
    );
}

async function deleteFlight(id) {
    const db = await connectDB();

    const flight = await flightModel.findFlightById(id);

    if (!flight) 
    {
        throw new Error("الرحلة غير موجودة");
    }

    if (!ObjectId.isValid(id)) return null;
    return db.collection("flights").deleteOne({ _id: new ObjectId(id) });
}
async function searchFlightsByFromTo({ from, to}) {
    const db = await connectDB();
    const query = {};

    if (from) query.from = from;
    if (to) query.to = to;

    return db.collection("flights").find(query).toArray();
}
async function searchFlightsByPrice({minprice,maxprice}) {
    const db = await connectDB();

    const query = {};

    if (minprice || maxprice) {
    query.price = {};
    if (minprice) query.price.$gte = parseFloat(minprice);
    if (maxprice) query.price.$lte = parseFloat(maxprice);
    }

    return db.collection("flights").find(query).toArray();
}
module.exports = { createFlight, findAllFlights, findFlightById , updateFlight , deleteFlight , searchFlightsByFromTo , searchFlightsByPrice };