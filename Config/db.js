// require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URI; 

const dbName = "TravelBookingSystemNodeJS";
const client = new MongoClient(url);

async function connectDB() {
    await client.connect();
    const db = client.db(dbName); 
    return db;
}

module.exports = connectDB;
