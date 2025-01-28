import mongoose from "mongoose";
import { dbURL } from "./Config.js";
import chalk from "chalk";

const ConnectDB = async () => {
    try {
        await mongoose.connect(dbURL, {
            
        });
        console.log(`${chalk.green("MongoDB Connected...")}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default ConnectDB;
