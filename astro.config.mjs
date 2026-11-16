// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isProdBranch = !process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === 'main';
const site =
  process.env.SITE_URL ??
  (isProdBranch ? 'https://institutolevante.org.br' : process.env.CF_PAGES_URL) ??
  'https://institutolevante.org.br';

export default defineConfig({
  site,
  trailingSlash: 'always',
  i18n: {
    locales: ['pt-br', 'en'],
    defaultLocale: 'pt-br',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') && !page.includes('/obrigado/') && !page.includes('/thank-you/'),
      i18n: { defaultLocale: 'pt-br', locales: { 'pt-br': 'pt-BR', en: 'en-US' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
