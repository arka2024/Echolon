import { normalizeAppLanguage } from '@/lib/language';

const cache = new Map<string, string>();
const pending = new Set<string>();
const listeners = new Set<() => void>();

function buildKey(language: string, text: string): string {
  return `${language}::${text}`;
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeRuntimeTranslationUpdates(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeTranslatedText(language: string, text: string): string {
  const targetLanguage = normalizeAppLanguage(language);

  if (!text || targetLanguage === 'en') {
    return text;
  }

  const key = buildKey(targetLanguage, text);
  const existing = cache.get(key);
  if (existing) {
    return existing;
  }

  if (typeof window === 'undefined') {
    return text;
  }

  if (!pending.has(key)) {
    pending.add(key);

    void fetch('/api/translate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { translatedText?: string };
        const translatedText = payload.translatedText?.trim();
        if (translatedText) {
          cache.set(key, translatedText);
          notify();
        }
      })
      .catch(() => undefined)
      .finally(() => {
        pending.delete(key);
      });
  }

  return text;
}
