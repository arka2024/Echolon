import { NextResponse } from 'next/server';
import fallbackData from '@/data/indian-languages-fallback.json';

type LanguageOption = {
  code: string;
  englishName: string;
  nativeName: string;
  regionCoverage: string;
  speakersRank: number;
};

type GemmaPayload = {
  response?: string;
};

function isLanguageOption(value: unknown): value is LanguageOption {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.code === 'string' &&
    typeof item.englishName === 'string' &&
    typeof item.nativeName === 'string' &&
    typeof item.regionCoverage === 'string' &&
    typeof item.speakersRank === 'number'
  );
}

function normalizeLanguages(languages: LanguageOption[]): LanguageOption[] {
  return languages
    .map((item) => ({
      code: item.code.toLowerCase(),
      englishName: item.englishName.trim(),
      nativeName: item.nativeName.trim(),
      regionCoverage: item.regionCoverage.trim(),
      speakersRank: item.speakersRank,
    }))
    .filter((item) => item.code.length > 0)
    .sort((a, b) => a.speakersRank - b.speakersRank);
}

async function fetchGemmaLanguages(): Promise<LanguageOption[] | null> {
  const gemmaApiUrl = process.env.GEMMA_API_URL ?? 'http://localhost:11434/api/generate';
  const model = process.env.GEMMA_MODEL_LANGUAGES ?? 'gemma3:3b';

  const prompt = [
    'Return JSON only with no markdown.',
    'Generate a list of majority Indian languages for UI language selection.',
    'Include 12 to 14 languages and always include English.',
    'Output schema: {"languages":[{"code":"hi","englishName":"Hindi","nativeName":"हिन्दी","regionCoverage":"...","speakersRank":1}]}.',
    'speakersRank should represent broad speaker popularity order in India.',
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
      return null;
    }

    const payload = (await response.json()) as GemmaPayload;
    if (!payload.response) {
      return null;
    }

    const parsed = JSON.parse(payload.response) as { languages?: unknown[] };
    if (!Array.isArray(parsed.languages)) {
      return null;
    }

    const validated = parsed.languages.filter(isLanguageOption);
    if (validated.length === 0) {
      return null;
    }

    return normalizeLanguages(validated);
  } catch {
    return null;
  }
}

export async function GET() {
  const generated = await fetchGemmaLanguages();
  const fallback = normalizeLanguages((fallbackData.languages as unknown[]).filter(isLanguageOption));
  const languages = generated ?? fallback;

  return NextResponse.json({
    source: generated ? 'gemma' : 'fallback',
    languages,
  });
}
