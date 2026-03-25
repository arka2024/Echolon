'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from '@/lib/translations';

type LanguageContextValue = {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = 'terraforge.language';
const EVENT_NAME = 'terrafarm-language-change';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLanguageState(stored);
      }
    } catch {
      // Ignore storage read failures
    }
  }, []);

  useEffect(() => {
    const customListener = (event: Event) => {
      const customEvent = event as CustomEvent<{ code?: string }>;
      const code = customEvent.detail?.code;
      if (code && typeof code === 'string') {
        setLanguageState(code);
      }
    };

    const storageListener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setLanguageState(event.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, customListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(EVENT_NAME, customListener);
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { code } }));
    } catch {
      // Ignore storage write failures
    }
  }, []);

  const t = useCallback((key: string) => translate(language, key), [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return value;
}
