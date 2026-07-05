import { connect } from "mongoose";
import { MONGO_URI } from "./env.config.js"

async function connectDB() {

    try {
        await connect(MONGO_URI)
        console.log("Database connected successfully")
    } catch (err) {
        console.log("MongoDB Error : ", err.message)
        process.exit(1)
    }
}
export default connectDB;