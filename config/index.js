import dotenv from "dotenv"
dotenv.config()
export const {
    APP_PORT,
    DEBUG_MODE,
    MONGO_URL,
    SECRET_KEY,
    REFRESH_SECRET,
    URL_FOR_IMAGE,
    EMAIL,
    PASSWORD
} = process.env
