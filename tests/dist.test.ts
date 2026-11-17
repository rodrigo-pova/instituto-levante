import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { routes } from '../src/i18n/routes';

const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

function routeToFilePath(pathname: string): string {
  const clean = pathname.replace(/^\/|\/$/g, '');
  if (!clean) return resolve(distDir, 'index.html');
  return resolve(distDir, clean, 'index.html');
}

describe('Production Build Verification (dist/)', () => {
  it('has generated all localized routes from the route map', () => {
    expect(
      existsSync(distDir),
      'Run npm run build before running dist tests',
    ).toBe(true);

    for (const [key, paths] of Object.entries(routes)) {
      const ptFile = routeToFilePath(paths['pt-br']);
      const enFile = routeToFilePath(paths.en);

      expect(
        existsSync(ptFile),
        `Missing build file for PT route [${key}]: ${ptFile}`,
      ).toBe(true);
      expect(
        existsSync(enFile),
        `Missing build file for EN route [${key}]: ${enFile}`,
      ).toBe(true);
    }
  });

  it('has generated 404 error pages', () => {
    const pt404 = resolve(distDir, '404.html');
    const en404 = resolve(distDir, 'en', '404', 'index.html');
    expect(existsSync(pt404)).toBe(true);
    expect(existsSync(en404)).toBe(true);
  });

  it('has built Sveltia CMS admin files with noindex', () => {
    const adminHtml = resolve(distDir, 'admin', 'index.html');
    const adminConfig = resolve(distDir, 'admin', 'config.yml');

    expect(existsSync(adminHtml)).toBe(true);
    expect(existsSync(adminConfig)).toBe(true);

    const htmlContent = readFileSync(adminHtml, 'utf-8');
    expect(htmlContent).toContain('noindex');
    expect(htmlContent).toContain('@sveltia/cms');
  });

  it('has copied Cloudflare Pages headers and redirects', () => {
    const headersPath = resolve(distDir, '_headers');
    const redirectsPath = resolve(distDir, '_redirects');

    expect(existsSync(headersPath)).toBe(true);
    expect(existsSync(redirectsPath)).toBe(true);

    const headers = readFileSync(headersPath, 'utf-8');
    expect(headers).toContain('X-Frame-Options: SAMEORIGIN');
    expect(headers).toContain('/admin/*');

    const redirects = readFileSync(redirectsPath, 'utf-8');
    expect(redirects).toContain('/team');
    expect(redirects).toContain('/en/team/');
  });

  it('has generated localized RSS feeds with valid items', () => {
    const ptRss = resolve(distDir, 'blog', 'rss.xml');
    const enRss = resolve(distDir, 'en', 'blog', 'rss.xml');

    expect(existsSync(ptRss)).toBe(true);
    expect(existsSync(enRss)).toBe(true);

    const ptXml = readFileSync(ptRss, 'utf-8');
    const enXml = readFileSync(enRss, 'utf-8');

    expect(ptXml).toContain('<rss version="2.0"');
    expect(ptXml).toContain('<title>');
    expect(ptXml).toContain('<item>');

    expect(enXml).toContain('<rss version="2.0"');
    expect(enXml).toContain('<title>');
    expect(enXml).toContain('<item>');
  });

  it('renders team page with alumni badges in both languages', () => {
    const ptTeamHtml = readFileSync(
      resolve(distDir, 'equipe', 'index.html'),
      'utf-8',
    );
    const enTeamHtml = readFileSync(
      resolve(distDir, 'en', 'team', 'index.html'),
      'utf-8',
    );

    expect(ptTeamHtml).toMatch(/Ex-alun/);
    expect(enTeamHtml).toMatch(/Alumni/);
  });

  it('renders inline PIX QR svg on donate pages', () => {
    const ptDonateHtml = readFileSync(
      resolve(distDir, 'doe', 'index.html'),
      'utf-8',
    );
    const enDonateHtml = readFileSync(
      resolve(distDir, 'en', 'donate', 'index.html'),
      'utf-8',
    );

    expect(ptDonateHtml).toContain('<svg');
    expect(ptDonateHtml).toContain('viewBox="0 0 47 47"');
    expect(enDonateHtml).toContain('<svg');
    expect(enDonateHtml).toContain('viewBox="0 0 47 47"');
  });

  it('includes hreflang tags linking alternates on localized pages', () => {
    const ptHomeHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
    expect(ptHomeHtml).toContain('hreflang="pt-BR"');
    expect(ptHomeHtml).toContain('hreflang="en-US"');
  });
});
