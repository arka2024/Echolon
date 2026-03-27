import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
<<<<<<< HEAD
=======
  const fallback = {
    totalUsers: 0,
    accuracy: "98%",
    revenue: "$24M",
    source: "fallback",
  };

>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
  try {
    await connectDB();

    const totalUsers = await User.countDocuments();

    return Response.json({
<<<<<<< HEAD
      totalUsers,   // ✅ FIXED NAME
      accuracy: "98%",
      revenue: "$24M"
    });

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
=======
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
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
    );
  }
}