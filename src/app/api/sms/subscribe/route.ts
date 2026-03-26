import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { saveSmsSubscription } from '@/lib/sms/state';
import { normalizeIndianPhone } from '@/lib/sms/utils';
import type { AlertCategory } from '@/lib/sms/types';

function normalizeCategories(input: unknown): AlertCategory[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const valid = input
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is AlertCategory => item === 'weather' || item === 'government');

  return Array.from(new Set(valid));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    phoneNumber?: string;
    enabled?: boolean;
    categories?: AlertCategory[];
  };

  const phoneNumber = normalizeIndianPhone(body.phoneNumber ?? '');
  if (!phoneNumber) {
    return NextResponse.json({ error: 'Valid phone number is required.' }, { status: 400 });
  }

  const alertsEnabled = Boolean(body.enabled);
  const categories = normalizeCategories(body.categories);

  try {
    await connectDB();
    await User.findOneAndUpdate(
      { phoneNumber },
      {
        $set: {
          phoneNumber,
          smsAlertsEnabled: alertsEnabled,
          alertCategories: categories,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ ok: true, storage: 'db', phoneNumber, alertsEnabled, categories });
  } catch {
    saveSmsSubscription({ phoneNumber, alertsEnabled, categories });
    return NextResponse.json({ ok: true, storage: 'memory', phoneNumber, alertsEnabled, categories });
  }
}
