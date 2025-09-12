const connectDB = require("../Config/db.js");
const flightModel = require("../Models/FlightModel");
const { ObjectId } = require("mongodb");

async function addToWishlist(userId, flightId) {
    const db = await connectDB();

    const flight = await flightModel.findFlightById(flightId);

    if (!flight) 
    {
        throw new Error("الرحلة غير موجودة");
    }
    const doc = {
    userId: userId,
    flightId: flightId,
    createdAt: new Date()
    };
    const exists = await db.collection("wishlists").findOne({
    userId: doc.userId,
    flightId: doc.flightId
    });

    if (exists) return exists;
    const res = await db.collection("wishlists").insertOne(doc);
    return res;
}

async function removeFromWishlist(userId, wishlistId) {
    const db = await connectDB();

    const wishlists = await db.collection("wishlists")
    .find({_id:new ObjectId(wishlistId)})
    .toArray();

if (wishlists.length === 0) {
    throw new Error("تم الحذف بالفعل");
}

    return db.collection("wishlists").deleteOne({
    userId: userId,
    _id: new ObjectId(wishlistId)
    });
}
async function getUserWishlist(userId) {
    const db = await connectDB();

    return db.collection("wishlists").aggregate([
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
module.exports = { addToWishlist , removeFromWishlist,getUserWishlist};