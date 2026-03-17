import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const opts = {
  bufferCommands: false,
};

export default async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  // Use MONGO_URI in .env (not MONGODB_URI) for consistency with this codebase
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/luxuryshop", opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.conn = null;
        cached.promise = null;
        throw new Error("Failed to connect to MongoDB");
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connection established");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}