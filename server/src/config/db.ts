import mongoose from "mongoose";
import { MONGO_URL } from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log("💿 Connected to the database");
  } catch (err) {
    console.error("⚠️ Warning: Couldn't connect to the database yet. The server will stay online but DB features might fail.", err);
    // On ne fait plus process.exit(1) pour éviter que Render ne boucle sur un crash
  }
};

export default connectDB;
