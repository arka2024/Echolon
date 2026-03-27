import { NextResponse } from 'next/server';
import { deleteLoginKeyRecord, getLoginKeyRecord, setLoginKeyRecord } from '@/lib/sms/state';
import { normalizeIndianPhone } from '@/lib/sms/utils';

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    phoneNumber?: string;
    key?: string;
  };

  const normalizedPhone = normalizeIndianPhone(body.phoneNumber ?? '');
  const key = (body.key ?? '').trim();

  if (!normalizedPhone || !key) {
    return NextResponse.json({ error: 'Phone number and private key are required.' }, { status: 400 });
  }

  const record = getLoginKeyRecord(normalizedPhone);
  if (!record) {
    return NextResponse.json({ ok: false, error: 'No active key found. Request a new key.' }, { status: 404 });
  }

  if (Date.now() > record.expiresAt) {
    deleteLoginKeyRecord(normalizedPhone);
    return NextResponse.json({ ok: false, error: 'Key expired. Request a new key.' }, { status: 410 });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    deleteLoginKeyRecord(normalizedPhone);
    return NextResponse.json({ ok: false, error: 'Too many attempts. Request a new key.' }, { status: 429 });
  }

  if (record.key !== key) {
    setLoginKeyRecord(normalizedPhone, { ...record, attempts: record.attempts + 1 });
    return NextResponse.json({ ok: false, error: 'Invalid private key.' }, { status: 401 });
  }

  deleteLoginKeyRecord(normalizedPhone);

  return NextResponse.json({ ok: true, phoneNumber: normalizedPhone });
}
