import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr', 'ar'];
export const defaultLocale = 'en';

// RTL languages
export const rtlLocales = ['ar'];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
