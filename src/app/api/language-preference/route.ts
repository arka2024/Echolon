import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import LanguagePreference from '@/models/LanguagePreference';
import { normalizeAppLanguage } from '@/lib/language';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId')?.trim();

  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({
      clientId,
      preferredLanguage: 'en',
      source: 'fallback',
    });
  }

  const existing = await LanguagePreference.findOne({ clientId }).lean();

  return NextResponse.json({
    clientId,
    preferredLanguage: normalizeAppLanguage(existing?.preferredLanguage),
    source: 'database',
  });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    clientId?: string;
    preferredLanguage?: string;
  };

  const clientId = body.clientId?.trim();
  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
  }

  const preferredLanguage = normalizeAppLanguage(body.preferredLanguage);

  try {
    await connectDB();
  } catch {
    return NextResponse.json({
      clientId,
      preferredLanguage,
      source: 'fallback',
    });
  }

  const updated = await LanguagePreference.findOneAndUpdate(
    { clientId },
    { clientId, preferredLanguage },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json({
    clientId: updated?.clientId ?? clientId,
    preferredLanguage: normalizeAppLanguage(updated?.preferredLanguage ?? preferredLanguage),
    source: 'database',
  });
}
