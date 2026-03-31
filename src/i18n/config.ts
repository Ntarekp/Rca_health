export const i18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: true,
};

export type Locale = 'en' | 'fr';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};
