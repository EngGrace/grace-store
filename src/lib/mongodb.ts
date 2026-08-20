import mongoose from "mongoose";

const MONGODB_URI: string = (process.env.MONGO_URI || process.env.MONGODB_URI)!;
if (!MONGODB_URI) {
  throw new Error("MONGO_URI environment variable is not set")
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected successfully to MongoDB:", MONGODB_URI);
      return mongooseInstance;
    }).catch((err) => {
      console.error("MongoDB connection error:", err);
      cached.promise = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

