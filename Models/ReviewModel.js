const connectDB = require("../Config/db.js");
const { ObjectId } = require("mongodb");

async function createReview(userId, flightId, rating, comment) {

    const db = await connectDB();

    const flight = await db.collection("flights").find({ _id: new ObjectId(flightId) }).toArray();
    if (flight.length == 0) {
        throw new Error("الرحله غير موجوده");
    }

    return db.collection("reviews").insertOne({
    userId: userId,
    flightId: flightId,
    rating: Number(rating),
    comment,
    createdAt: new Date()
    });

}    

async function deleteReview(userId, flightId) {
    const db = await connectDB();

    const flight = await db.collection("flights").findOne({ _id: new ObjectId(flightId) });
    if (!flight) {
        throw new Error("الرحلة غير موجودة");
    }

    const review = await db.collection("reviews").findOne({
        userId: userId,
        flightId: flightId
    });

    if (!review) {
        throw new Error("التقييم غير موجود");
    }

    const result = await db.collection("reviews").deleteOne({
        userId: userId,
        flightId: flightId
    });

    return result;
}

async function  getUserReviews(userId) {
    const db = await connectDB();

    return db.collection("reviews").aggregate([
        {
            $match: { userId: userId } 
        },
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
                as: "flightDetails"            
            }
        },
        {
            $unwind: "$flightDetails"         
        },
        {
            $project: {                       
                rating: 1,
                comment: 1,
                createdAt: 1,
                "flightDetails._id": 1,
                "flightDetails.flightNumber": 1,
                "flightDetails.from": 1,
                "flightDetails.to": 1,
                "flightDetails.airline": 1
            }
        }
    ]).toArray();
}
module.exports = {createReview , deleteReview , getUserReviews};