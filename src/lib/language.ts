export const SUPPORTED_LANGUAGE_CODES = [
  'en',
  'hi',
  'bn',
  'mr',
  'te',
  'ta',
  'gu',
  'ur',
  'kn',
  'ml',
  'pa',
  'or',
  'as',
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGE_CODES)[number];

export function normalizeAppLanguage(code: string | null | undefined): AppLanguage {
  if (code && SUPPORTED_LANGUAGE_CODES.includes(code as AppLanguage)) {
    return code as AppLanguage;
  }
  return 'en';
}
