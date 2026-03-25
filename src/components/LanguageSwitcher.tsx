'use client';

import { useEffect, useMemo, useState } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

type LanguageOption = {
  code: string;
  englishName: string;
  nativeName: string;
  regionCoverage: string;
  speakersRank: number;
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

const defaultOptions: LanguageOption[] = [
  { code: 'en', englishName: 'English', nativeName: 'English', regionCoverage: 'Pan India', speakersRank: 99 },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', regionCoverage: 'North and Central India', speakersRank: 1 },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', regionCoverage: 'West Bengal and Tripura', speakersRank: 2 },
];

export function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [options, setOptions] = useState<LanguageOption[]>(defaultOptions);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/languages', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { languages?: LanguageOption[] };
        if (!Array.isArray(payload.languages) || payload.languages.length === 0) {
          return;
        }

        setOptions(payload.languages);
      } catch {
        // Keep fallback options
      }
    };

    void load();
  }, []);

  const selectedLabel = useMemo(() => {
    const found = options.find((item) => item.code === language);
    return found?.englishName ?? 'English';
  }, [options, language]);

  return (
    <label className={`inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground ${className}`}>
      <Languages className="h-4 w-4 text-primary" />
      {!compact && <span className="hidden lg:inline text-muted-foreground">{selectedLabel}</span>}
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="min-w-[96px] bg-transparent text-xs font-semibold outline-none"
        aria-label="Select language"
      >
        {options.map((item) => (
          <option key={item.code} value={item.code}>
            {item.englishName}
          </option>
        ))}
      </select>
    </label>
  );
}
