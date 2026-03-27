import { NextResponse } from 'next/server';
import fallbackData from '@/data/indian-languages-fallback.json';

type LanguageOption = {
  code: string;
  englishName: string;
};

type GemmaResponse = {
  response?: string;
};

const fallbackWordsByLanguage: Record<string, string[]> = {
  en: ['farm', 'soil', 'rain', 'market', 'yield'],
  hi: ['खेती', 'मिट्टी', 'बारिश', 'बाजार', 'उपज'],
  bn: ['খামার', 'মাটি', 'বৃষ্টি', 'বাজার', 'ফলন'],
  mr: ['शेती', 'माती', 'पाऊस', 'बाजार', 'उत्पन्न'],
  te: ['వ్యవసాయం', 'నేల', 'వర్షం', 'మార్కెట్', 'పంట'],
  ta: ['விவசாயம்', 'மண்', 'மழை', 'சந்தை', 'விளைச்சல்'],
  gu: ['ખેતી', 'માટી', 'વરસાદ', 'બજાર', 'ઉપજ'],
  ur: ['کاشتکاری', 'مٹی', 'بارش', 'بازار', 'پیداوار'],
  kn: ['ಕೃಷಿ', 'ಮಣ್ಣು', 'ಮಳೆ', 'ಮಾರುಕಟ್ಟೆ', 'ಬೆಳೆ'],
  ml: ['കൃഷി', 'മണ്ണ്', 'മഴ', 'വിപണി', 'വിളവ്'],
  pa: ['ਖੇਤੀ', 'ਮਿੱਟੀ', 'ਮੀਂਹ', 'ਬਾਜ਼ਾਰ', 'ਪੈਦਾਵਾਰ'],
  or: ['ଚାଷ', 'ମାଟି', 'ବର୍ଷା', 'ବଜାର', 'ଉତ୍ପାଦନ'],
  as: ['কৃষি', 'মাটি', 'বৰষুণ', 'বজাৰ', 'উৎপাদন'],
};

function isLanguageOption(value: unknown): value is LanguageOption {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.code === 'string' && typeof item.englishName === 'string';
}

function cleanWords(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 5);
}

async function getGemmaWords(languageCode: string, languageName: string): Promise<string[] | null> {
  const gemmaApiUrl = process.env.GEMMA_API_URL ?? 'http://localhost:11434/api/generate';
  const model = process.env.GEMMA_MODEL_TRANSLATIONS ?? 'gemma2:2b';

  const prompt = [
    'Return JSON only with no markdown.',
    `Generate exactly 5 short farming words in ${languageName} (${languageCode}).`,
    'Words must be common agriculture terms suitable for a language preview.',
    'Output schema: {"words":["...","...","...","...","..."]}.',
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

    const payload = (await response.json()) as GemmaResponse;
    if (!payload.response) {
      return null;
    }

    const parsed = JSON.parse(payload.response) as { words?: unknown };
    const words = cleanWords(parsed.words);
    return words.length > 0 ? words : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedCode = searchParams.get('code')?.toLowerCase().trim();

  const languageItems = (fallbackData.languages as unknown[])
    .filter(isLanguageOption)
    .map((item) => ({ code: item.code.toLowerCase(), englishName: item.englishName }));

  const targets = requestedCode ? languageItems.filter((item) => item.code === requestedCode) : languageItems;

  if (targets.length === 0) {
    return NextResponse.json({ error: 'Unsupported language code.' }, { status: 400 });
  }

  if (!requestedCode) {
    return NextResponse.json({
      wordsByLanguage: Object.fromEntries(
        targets.map((item) => [item.code, fallbackWordsByLanguage[item.code] ?? fallbackWordsByLanguage.en])
      ),
      sources: Object.fromEntries(targets.map((item) => [item.code, 'fallback'])),
    });
  }

  const item = targets[0];
  const gemmaWords = await getGemmaWords(item.code, item.englishName);
  const fallbackWords = fallbackWordsByLanguage[item.code] ?? fallbackWordsByLanguage.en;

  return NextResponse.json({
    wordsByLanguage: { [item.code]: gemmaWords ?? fallbackWords },
    sources: { [item.code]: gemmaWords ? 'gemma2:2b' : 'fallback' },
  });
}
