import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

const { connection } = mongoose;

connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

connection.once("open", () => {
    console.log("Connected to MongoDB");
});

export default connection;
