import mongoose from "mongoose";

<<<<<<< HEAD
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
=======
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, {
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
      dbName: "farmer-app",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}