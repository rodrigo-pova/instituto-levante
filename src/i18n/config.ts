export const locales = ['pt-br', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-br';
export const bcp47: Record<Locale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
};
export const localeLabel: Record<Locale, string> = {
  'pt-br': 'Português',
  en: 'English',
};
