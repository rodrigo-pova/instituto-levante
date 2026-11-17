import type { Locale } from './config';

export const routes = {
  home: { 'pt-br': '/', en: '/en/' },
  about: { 'pt-br': '/sobre/', en: '/en/about/' },
  team: { 'pt-br': '/equipe/', en: '/en/team/' },
  partners: { 'pt-br': '/parceiros/', en: '/en/partners/' },
  partnersThanks: {
    'pt-br': '/parceiros/obrigado/',
    en: '/en/partners/thank-you/',
  },
  donate: { 'pt-br': '/doe/', en: '/en/donate/' },
  getInvolved: { 'pt-br': '/participe/', en: '/en/get-involved/' },
  transparency: { 'pt-br': '/transparencia/', en: '/en/transparency/' },
  contact: { 'pt-br': '/contato/', en: '/en/contact/' },
  contactThanks: {
    'pt-br': '/contato/obrigado/',
    en: '/en/contact/thank-you/',
  },
  blog: { 'pt-br': '/blog/', en: '/en/blog/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;
