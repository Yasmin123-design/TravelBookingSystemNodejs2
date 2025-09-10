const connectDB = require("../Config/db.js");

async function createPayment(paymentData) {
    const db = await connectDB();
    return db.collection("payments").insertOne(paymentData);
}

async function getPaymentsByUser(userId) {
    const db = await connectDB();
    return db.collection("payments").find({ userId }).toArray();
}
async function findAll() {
    const db = await connectDB();
    return db.collection("payments").find().toArray();
}
module.exports = { createPayment, getPaymentsByUser , findAll };
