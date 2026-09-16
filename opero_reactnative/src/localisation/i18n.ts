import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n, { type LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

export type SupportedLanguage = keyof typeof resources;

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ar'];
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];
const FALLBACK_LANGUAGE: SupportedLanguage = 'en';
const LANGUAGE_STORAGE_KEY = '@opero/language';

const isSupportedLanguage = (value: string | null): value is SupportedLanguage =>
  !!value && (SUPPORTED_LANGUAGES as string[]).includes(value);

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (language: string) => void) => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isSupportedLanguage(stored)) {
        callback(stored);
        return;
      }
    } catch {
      // storage unavailable — fall through to device locale detection
    }
    const best = RNLocalize.findBestLanguageTag(SUPPORTED_LANGUAGES);
    callback(best?.languageTag ?? FALLBACK_LANGUAGE);
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language).catch(() => {});
  },
};

export const applyRTL = (language: string) => {
  const isRTL = RTL_LANGUAGES.includes(language as SupportedLanguage);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

i18n.on('languageChanged', applyRTL);

export default i18n;
