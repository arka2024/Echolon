import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { listSmsSubscriptions } from '@/lib/sms/state';
import { sendSms } from '@/lib/sms/service';
import type { AlertCategory } from '@/lib/sms/types';

const ALERT_TOKEN = process.env.ALERT_DISPATCH_TOKEN;

async function listRecipients(category: AlertCategory): Promise<string[]> {
  try {
    await connectDB();
    const users = await User.find({
      smsAlertsEnabled: true,
      alertCategories: category,
      phoneNumber: { $exists: true, $ne: '' },
    }).lean();

    return users
      .map((item) => item.phoneNumber)
      .filter((value): value is string => typeof value === 'string' && value.length > 0);
  } catch {
    return listSmsSubscriptions(category).map((item) => item.phoneNumber);
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') ?? '';
  if (ALERT_TOKEN && authHeader !== `Bearer ${ALERT_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    category?: AlertCategory;
    title?: string;
    message?: string;
    phones?: string[];
  };

  const category: AlertCategory = body.category === 'government' ? 'government' : 'weather';
  const title = (body.title ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const recipients = Array.isArray(body.phones) && body.phones.length > 0
    ? body.phones
    : await listRecipients(category);

  const uniqueRecipients = Array.from(new Set(recipients));
  const fullMessage = `${title ? `${title}: ` : ''}${message}`;

  let sent = 0;
  for (const phone of uniqueRecipients) {
    const result = await sendSms(phone, fullMessage);
    if (result.ok) {
      sent += 1;
    }
  }

  return NextResponse.json({
    category,
    recipients: uniqueRecipients.length,
    sent,
  });
}
