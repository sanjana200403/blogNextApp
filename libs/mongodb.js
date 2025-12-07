import mongoose from "mongoose";

const connectMongoDb = async () => {
  if (mongoose.connections[0].readyState) {
    // Use existing connection
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Please define MONGO_URL in .env.local");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectMongoDb;
