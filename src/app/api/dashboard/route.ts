import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();

    return Response.json({
      totalUsers,   // ✅ FIXED NAME
      accuracy: "98%",
      revenue: "$24M"
    });

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}