'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import { translate } from '@/lib/translations';
=======
import i18n from '@/lib/i18n';
import { normalizeAppLanguage } from '@/lib/language';
import { subscribeRuntimeTranslationUpdates } from '@/lib/runtimeTranslation';
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

type LanguageContextValue = {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = 'terraforge.language';
<<<<<<< HEAD
=======
const CLIENT_ID_KEY = 'terraforge.client-id';
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
const EVENT_NAME = 'terrafarm-language-change';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
<<<<<<< HEAD

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLanguageState(stored);
      }
    } catch {
      // Ignore storage read failures
=======
  const [translationVersion, setTranslationVersion] = useState(0);

  const getClientId = useCallback(() => {
    try {
      const existing = localStorage.getItem(CLIENT_ID_KEY);
      if (existing) {
        return existing;
      }

      const created = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, created);
      return created;
    } catch {
      return null;
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
=======
    let isMounted = true;

    const bootstrapLanguage = async () => {
      let resolved = 'en';

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        resolved = normalizeAppLanguage(stored);
      } catch {
        // Ignore storage read failures
      }

      const clientId = getClientId();
      if (clientId) {
        try {
          const response = await fetch(`/api/language-preference?clientId=${encodeURIComponent(clientId)}`, {
            cache: 'no-store',
          });

          if (response.ok) {
            const payload = (await response.json()) as { preferredLanguage?: string };
            resolved = normalizeAppLanguage(payload.preferredLanguage ?? resolved);
          }
        } catch {
          // Ignore preference fetch failures
        }
      }

      if (!isMounted) {
        return;
      }

      setLanguageState(resolved);
      await i18n.changeLanguage(resolved);
    };

    void bootstrapLanguage();

    return () => {
      isMounted = false;
    };
  }, [getClientId]);

  useEffect(() => {
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
    const customListener = (event: Event) => {
      const customEvent = event as CustomEvent<{ code?: string }>;
      const code = customEvent.detail?.code;
      if (code && typeof code === 'string') {
<<<<<<< HEAD
        setLanguageState(code);
=======
        const normalized = normalizeAppLanguage(code);
        setLanguageState(normalized);
        void i18n.changeLanguage(normalized);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
      }
    };

    const storageListener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
<<<<<<< HEAD
        setLanguageState(event.newValue);
=======
        const normalized = normalizeAppLanguage(event.newValue);
        setLanguageState(normalized);
        void i18n.changeLanguage(normalized);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
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
<<<<<<< HEAD
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
=======
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  useEffect(() => {
    return subscribeRuntimeTranslationUpdates(() => {
      setTranslationVersion((current) => current + 1);
    });
  }, []);

  const setLanguage = useCallback((code: string) => {
    const normalized = normalizeAppLanguage(code);
    setLanguageState(normalized);
    void i18n.changeLanguage(normalized);

    try {
      localStorage.setItem(STORAGE_KEY, normalized);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { code: normalized } }));
    } catch {
      // Ignore storage write failures
    }

    const clientId = getClientId();
    if (!clientId) {
      return;
    }

    void fetch('/api/language-preference', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, preferredLanguage: normalized }),
    }).catch(() => undefined);
  }, [getClientId]);

  const t = useCallback((key: string) => i18n.t(key, { ns: 'common', defaultValue: key }) as string, []);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t, translationVersion]);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return value;
}
