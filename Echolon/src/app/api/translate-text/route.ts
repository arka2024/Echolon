import { NextResponse } from 'next/server';
import { normalizeAppLanguage } from '@/lib/language';

type TranslateRequest = {
  text?: string;
  targetLanguage?: string;
};

type GemmaResponse = {
  response?: string;
};

const languageNameByCode: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  mr: 'Marathi',
  te: 'Telugu',
  ta: 'Tamil',
  gu: 'Gujarati',
  ur: 'Urdu',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
  or: 'Odia',
  as: 'Assamese',
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TranslateRequest;
  const text = body.text?.trim();
  const targetLanguage = normalizeAppLanguage(body.targetLanguage);

  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  if (targetLanguage === 'en') {
    return NextResponse.json({ translatedText: text, source: 'passthrough' });
  }

  const gemmaApiUrl = process.env.GEMMA_API_URL ?? 'http://localhost:11434/api/generate';
  const model = process.env.GEMMA_MODEL_TRANSLATIONS ?? 'gemma2:2b';
  const targetName = languageNameByCode[targetLanguage] ?? targetLanguage;

  const prompt = [
    'Return JSON only with no markdown.',
    `Translate the following text to ${targetName}.`,
    'Keep meaning accurate and keep numbers/units unchanged.',
    'Output schema: {"translatedText":"..."}.',
    `Text: ${text}`,
  ].join(' ');

  try {
    const response = await fetch(gemmaApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ translatedText: text, source: 'fallback' });
    }

    const payload = (await response.json()) as GemmaResponse;
    if (!payload.response) {
      return NextResponse.json({ translatedText: text, source: 'fallback' });
    }

    const parsed = JSON.parse(payload.response) as { translatedText?: string };
    const translatedText = parsed.translatedText?.trim();

    return NextResponse.json({
      translatedText: translatedText || text,
      source: translatedText ? 'gemma2:2b' : 'fallback',
    });
  } catch {
    return NextResponse.json({ translatedText: text, source: 'fallback' });
  }
}
