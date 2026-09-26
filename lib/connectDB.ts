import mongoose from "mongoose";
import {
  getConfiguredMongoUri,
  hasConfiguredMongoUri as hasMongoUri,
} from "@/lib/mongoEnv";

declare global {
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
  serverSelectionTimeoutMS: 5000,
};

const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/luxuryshop";

export function hasConfiguredMongoUri(): boolean {
  return hasMongoUri();
}

function getMongoUri(): string {
  const configuredUri = getConfiguredMongoUri();

  if (configuredUri) {
    return configuredUri;
  }

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_MONGODB_URI;
  }

  throw new Error("Missing MongoDB connection string. Set MONGO_URI, MONGODB_URI, or DATABASE_URL.");
}

export default async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = getMongoUri();

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.conn = null;
        cached.promise = null;
        throw error;
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
