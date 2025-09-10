const connectDB = require("../Config/db.js");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

async function createUser(user) {
    const db = await connectDB();
    return db.collection("users").insertOne(user);
}

async function findByEmail(email) {
    const db = await connectDB();
    return db.collection("users").findOne({ email });
}

async function findAll() {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();

    const sanitizedUsers = users.map(user => {
        const { password, ...userData } = user;
        return userData;
    });

    return sanitizedUsers;
}


async function findById(id) {
    const db = await connectDB();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
}
async function updateUser(id, name) {
    const db = await connectDB();

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!user) {
        throw new Error("User not found");
    }
    if (!name) {
        throw new Error("Name is required");
    }
    await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: { name } }
    );

    return db.collection("users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
}
async function updatePassword(userId, oldPassword, newPassword) {
    const db = await connectDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashed } }
    );

    return true;
}
async function findUserById(id) {
    const db = await connectDB();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
}
async function updateRestedPassword(userId, hashedPassword) {
    const db = await connectDB();
    return db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedPassword } }
    );
}
module.exports = { createUser, findByEmail, findAll , findById , updateUser,updatePassword , findUserById , updateRestedPassword};