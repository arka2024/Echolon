type SendSmsResult = {
  ok: boolean;
  source: 'twilio' | 'textbelt' | 'mock';
  error?: string;
};

const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';
const TEXTBELT_API = 'https://textbelt.com/text';

async function sendViaTwilio(phoneNumber: string, message: string): Promise<SendSmsResult | null> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }

  try {
    const authValue = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const body = new URLSearchParams({
      To: phoneNumber,
      From: fromNumber,
      Body: message,
    });

    const response = await fetch(`${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authValue}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { ok: false, source: 'twilio', error: errorBody };
    }

    return { ok: true, source: 'twilio' };
  } catch (error) {
    return { ok: false, source: 'twilio', error: error instanceof Error ? error.message : 'Unknown SMS error' };
  }
}

async function sendViaTextbelt(phoneNumber: string, message: string): Promise<SendSmsResult | null> {
  const configuredKey = process.env.TEXTBELT_API_KEY;
  const useFreeTextbelt = process.env.TEXTBELT_USE_FREE === 'true';
  const keys = Array.from(new Set([
    configuredKey,
    useFreeTextbelt ? 'textbelt' : undefined,
  ].filter((value): value is string => Boolean(value))));

  if (keys.length === 0) {
    return null;
  }

  try {
    const candidatePhones = Array.from(new Set([phoneNumber, phoneNumber.replace(/^\+/, '')]));
    let lastError = 'Textbelt failed to send message.';

    for (const key of keys) {
      for (const candidate of candidatePhones) {
        const body = new URLSearchParams({
          phone: candidate,
          message,
          key,
        });

        const response = await fetch(TEXTBELT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });

        const data = (await response.json().catch(() => ({}))) as {
          success?: boolean;
          error?: string;
          quotaRemaining?: number;
          textId?: string;
        };

        if (response.ok && data.success) {
          return { ok: true, source: 'textbelt' };
        }

        const errorText = data.error || `Textbelt request failed (${response.status})`;
        lastError = errorText;

        // Retry with alternate phone format first, then alternate key if configured.
        if (/invalid phone/i.test(errorText)) {
          continue;
        }

        if (/out of quota|quota/i.test(errorText)) {
          continue;
        }

        return {
          ok: false,
          source: 'textbelt',
          error: errorText,
        };
      }
    }

    return {
      ok: false,
      source: 'textbelt',
      error: lastError,
    };
  } catch (error) {
    return { ok: false, source: 'textbelt', error: error instanceof Error ? error.message : 'Unknown SMS error' };
  }
}

export async function sendSms(phoneNumber: string, message: string): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || 'auto').toLowerCase();
  const allowMockFallback = process.env.SMS_ALLOW_DEV_FALLBACK !== 'false' && process.env.NODE_ENV !== 'production';

  if (provider === 'twilio') {
    const twilio = await sendViaTwilio(phoneNumber, message);
    if (twilio) {
      return twilio;
    }
    return allowMockFallback
      ? { ok: true, source: 'mock' }
      : { ok: false, source: 'twilio', error: 'Twilio is not configured.' };
  }

  if (provider === 'textbelt') {
    const textbelt = await sendViaTextbelt(phoneNumber, message);
    if (textbelt) {
      if (!textbelt.ok && allowMockFallback) {
        console.warn(`[SMS-FALLBACK] textbelt failed, falling back to mock. error=${textbelt.error ?? 'unknown'}`);
        return { ok: true, source: 'mock', error: textbelt.error };
      }
      return textbelt;
    }
    return allowMockFallback
      ? { ok: true, source: 'mock' }
      : { ok: false, source: 'textbelt', error: 'Textbelt is not configured.' };
  }

  if (provider === 'auto') {
    const twilio = await sendViaTwilio(phoneNumber, message);
    if (twilio?.ok) {
      return twilio;
    }

    const textbelt = await sendViaTextbelt(phoneNumber, message);
    if (textbelt?.ok) {
      return textbelt;
    }

    if (twilio) {
      return twilio;
    }
    if (textbelt) {
      return textbelt;
    }
  }

  console.log(`[SMS-MOCK] to=${phoneNumber} message=${message}`);
  return { ok: true, source: 'mock' };
}
