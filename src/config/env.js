import dotenv from "dotenv";
import { existsSync } from "fs";

// Load environment variables immediately
// Try to load .env.local first, then .env
if (existsSync(".env.local")) {
    dotenv.config({ path: ".env.local" });
} else if (existsSync(".env")) {
    dotenv.config({ path: ".env" });
} else {
    dotenv.config(); // fallback to default .env loading
}
