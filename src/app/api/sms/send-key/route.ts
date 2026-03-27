import { NextResponse } from 'next/server';
import { buildPrivateKeyMessage, generatePrivateLoginKey, normalizeIndianPhone } from '@/lib/sms/utils';
import { getLastSentAt, setLastSentAt, setLoginKeyRecord } from '@/lib/sms/state';
import { sendSms } from '@/lib/sms/service';

const KEY_TTL_MS = 10 * 60 * 1000;
const MIN_RESEND_INTERVAL_MS = 30 * 1000;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { phoneNumber?: string };
  const normalizedPhone = normalizeIndianPhone(body.phoneNumber ?? '');

  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Valid phone number is required.' }, { status: 400 });
  }

  const now = Date.now();
  const lastSentAt = getLastSentAt(normalizedPhone);
  if (now - lastSentAt < MIN_RESEND_INTERVAL_MS) {
    return NextResponse.json({
      error: 'Please wait before requesting another key.',
      retryAfterMs: MIN_RESEND_INTERVAL_MS - (now - lastSentAt),
    }, { status: 429 });
  }

  const key = generatePrivateLoginKey();
  setLoginKeyRecord(normalizedPhone, { key, expiresAt: now + KEY_TTL_MS, attempts: 0 });
  setLastSentAt(normalizedPhone, now);

  const smsResult = await sendSms(normalizedPhone, buildPrivateKeyMessage(key));
  const allowDevFallback = process.env.NODE_ENV !== 'production' && process.env.SMS_ALLOW_DEV_FALLBACK !== 'false';
  const keySent = smsResult.ok || allowDevFallback;

  return NextResponse.json({
    ok: keySent,
    phoneNumber: normalizedPhone,
    keySent,
    source: smsResult.source,
    providerError: smsResult.error,
    // Return key only in non-production mock mode to simplify local testing.
    debugKey: smsResult.source === 'mock' && process.env.NODE_ENV !== 'production' ? key : undefined,
  });
}
