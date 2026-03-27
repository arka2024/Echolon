import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const fallback = {
    totalUsers: 0,
    accuracy: "98%",
    revenue: "$24M",
    source: "fallback",
  };

  try {
    await connectDB();

    const totalUsers = await User.countDocuments();

    return Response.json({
      totalUsers,
      accuracy: "98%",
      revenue: "$24M",
      source: "database",
    });

  } catch {
    return Response.json(
      {
        ...fallback,
        warning: "Database unavailable. Showing fallback dashboard metrics.",
      },
      { status: 200 }
    );
  }
}