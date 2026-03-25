import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "MongoDB Connected ✅" });
  } catch (error) {
    return Response.json({ error: "Connection Failed ❌" });
  }
}