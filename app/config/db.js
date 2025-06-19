import mongoose from "mongoose";

let cached = global.mongoose || {conn: null, promise: null};

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });

    try{
        cached.conn = await cached.promise;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }


  }
  

  return cached.conn;
}