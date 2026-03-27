import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGE_CODES, type AppLanguage, normalizeAppLanguage } from '@/lib/language';

import enCommon from '@/locales/en/common.json';
import hiCommon from '@/locales/hi/common.json';
import bnCommon from '@/locales/bn/common.json';
import mrCommon from '@/locales/mr/common.json';
import teCommon from '@/locales/te/common.json';
import taCommon from '@/locales/ta/common.json';
import guCommon from '@/locales/gu/common.json';
import urCommon from '@/locales/ur/common.json';
import knCommon from '@/locales/kn/common.json';
import mlCommon from '@/locales/ml/common.json';
import paCommon from '@/locales/pa/common.json';
import orCommon from '@/locales/or/common.json';
import asCommon from '@/locales/as/common.json';

const resources = {
  en: { common: enCommon },
  hi: { common: hiCommon },
  bn: { common: bnCommon },
  mr: { common: mrCommon },
  te: { common: teCommon },
  ta: { common: taCommon },
  gu: { common: guCommon },
  ur: { common: urCommon },
  kn: { common: knCommon },
  ml: { common: mlCommon },
  pa: { common: paCommon },
  or: { common: orCommon },
  as: { common: asCommon },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false,
    returnNull: false,
  });
}

export default i18n;
