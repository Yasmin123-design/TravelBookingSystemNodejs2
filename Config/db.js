const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; 
const dbName = "TravelBookingSystemNodeJS";
const client = new MongoClient(url);

async function connectDB() {
    await client.connect();
    const db = client.db(dbName); 
    return db;
}

module.exports = connectDB;
