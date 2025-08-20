import mongoose from "mongoose";
import logger from "../utils/logger.js";

const createConnection = () => {
    mongoose
        .connect(process.env.DB_URL, {
            dbName: process.env.DB_NAME,
            maxPoolSize: 100,
        })
        .then(() => logger.info("Database Connected"))
        .catch((error) => logger.error("Database connection error:", error));
};

export default { createConnection };
