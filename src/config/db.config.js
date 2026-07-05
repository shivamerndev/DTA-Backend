import { connect } from "mongoose";
import { MONGO_URI } from "./env.config.js"
import logger from "../utils/logger.js";

async function connectDB() {

    try {
        await connect(MONGO_URI)
        logger.info("Database connected successfully")
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`, { stack: err.stack })
        process.exit(1)
    }
}
export default connectDB;