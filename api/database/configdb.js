/* eslint-disable no-undef */
import mongoose from "mongoose";

const connect = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGODB_URI, { 
            dbName: process.env.MONGODB_NAME 
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
export default { connect };