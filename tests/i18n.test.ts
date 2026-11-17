import { describe, it, expect } from 'vitest';
import {
  getLocaleFromUrl,
  useTranslations,
  path,
  getAlternates,
  splitId,
  formatDate,
} from '@/i18n/utils';
import { routes } from '@/i18n/routes';
import { ui } from '@/i18n/ui';

describe('i18n infrastructure', () => {
  it('correctly detects locale from URLs', () => {
    expect(getLocaleFromUrl('/en/about/')).toBe('en');
    expect(getLocaleFromUrl('/en/')).toBe('en');
    expect(getLocaleFromUrl('/sobre/')).toBe('pt-br');
    expect(getLocaleFromUrl('/')).toBe('pt-br');
    expect(
      getLocaleFromUrl(new URL('https://institutolevante.org.br/en/team/')),
    ).toBe('en');
    expect(
      getLocaleFromUrl(new URL('https://institutolevante.org.br/equipe/')),
    ).toBe('pt-br');
  });

  it('guarantees bidirectional route symmetry for every route key', () => {
    for (const [key, localizedRoutes] of Object.entries(routes)) {
      expect(
        localizedRoutes['pt-br'],
        `pt-br route missing for ${key}`,
      ).toBeDefined();
      expect(localizedRoutes.en, `en route missing for ${key}`).toBeDefined();
      expect(localizedRoutes['pt-br'].endsWith('/')).toBe(true);
      expect(localizedRoutes.en.endsWith('/')).toBe(true);
    }
  });

  it('provides translations with fallback to default locale', () => {
    const tPt = useTranslations('pt-br');
    const tEn = useTranslations('en');

    expect(tPt('nav.about')).toBe('Sobre');
    expect(tEn('nav.about')).toBe('About');
    expect(tPt('team.alumniBadge')).toBe('Ex-aluno(a) do Levante');
    expect(tEn('team.alumniBadge')).toBe('Levante Alumni');
  });

  it('guarantees UI dictionary key parity between pt-br and en', () => {
    const ptKeys = Object.keys(ui['pt-br']).sort();
    const enKeys = Object.keys(ui.en).sort();
    expect(ptKeys).toEqual(enKeys);
  });

  it('generates correct paths for static routes and dynamic blog posts', () => {
    expect(path('home', 'pt-br')).toBe('/');
    expect(path('home', 'en')).toBe('/en/');
    expect(path('team', 'pt-br')).toBe('/equipe/');
    expect(path('team', 'en')).toBe('/en/team/');
    expect(path('post', 'pt-br', 'torneio-4-anos')).toBe(
      '/blog/torneio-4-anos/',
    );
    expect(path('post', 'en', 'torneio-4-anos')).toBe(
      '/en/blog/torneio-4-anos/',
    );
  });

  it('generates symmetric alternate links for SEO hreflang and language switcher', () => {
    const alternates = getAlternates('team');
    expect(alternates).toHaveLength(2);
    expect(alternates[0]).toEqual({
      locale: 'pt-br',
      href: '/equipe/',
      lang: 'pt-BR',
    });
    expect(alternates[1]).toEqual({
      locale: 'en',
      href: '/en/team/',
      lang: 'en-US',
    });
  });

  it('splits and parses collection IDs into locale and slug', () => {
    expect(splitId('pt-br/torneio-4-anos')).toEqual({
      locale: 'pt-br',
      slug: 'torneio-4-anos',
    });
    expect(splitId('en/dia-de-teatro')).toEqual({
      locale: 'en',
      slug: 'dia-de-teatro',
    });
  });

  it('formats dates localized via Intl API', () => {
    const testDate = new Date('2024-10-15T12:00:00Z');
    const ptFormatted = formatDate(testDate, 'pt-br');
    const enFormatted = formatDate(testDate, 'en');

    expect(ptFormatted.toLowerCase()).toContain('outubro');
    expect(enFormatted.toLowerCase()).toContain('october');
  });
});
