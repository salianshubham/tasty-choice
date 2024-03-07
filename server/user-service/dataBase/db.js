const mongoose = require("mongoose");


const URI = process.env.DATABASE_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connection success...");
    } catch (error) {
        console.error("Connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
