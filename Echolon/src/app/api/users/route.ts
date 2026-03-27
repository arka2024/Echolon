import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const user = await User.create(body);

  return Response.json(user);
}

export async function GET() {
  await connectDB();

  const users = await User.find();

  return Response.json(users);
}

export async function PATCH(req: Request) {
  await connectDB();

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    email?: string;
    preferredLanguage?: string;
  };

  const preferredLanguage = typeof body.preferredLanguage === 'string' ? body.preferredLanguage.trim() : '';
  if (!preferredLanguage) {
    return Response.json({ error: 'preferredLanguage is required' }, { status: 400 });
  }

  const query = body.id ? { _id: body.id } : body.email ? { email: body.email } : null;
  if (!query) {
    return Response.json({ error: 'id or email is required' }, { status: 400 });
  }

  const updated = await User.findOneAndUpdate(
    query,
    { preferredLanguage },
    { new: true }
  );

  if (!updated) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(updated);
}