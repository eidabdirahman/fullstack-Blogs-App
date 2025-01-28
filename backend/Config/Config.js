import dotenv from "dotenv";
dotenv.config();


export const dbURL = process.env.MONGO_URL;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_kEY = process.env.CLOUDINARY_API_kEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET