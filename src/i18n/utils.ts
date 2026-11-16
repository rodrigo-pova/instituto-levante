import { defaultLocale, locales, bcp47, type Locale } from './config';
import { routes, type RouteKey } from './routes';
import { ui, type UIKey } from './ui';

export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'en') {
    return 'en';
  }
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key] ?? key;
  };
}

export function path(
  routeKey: RouteKey | 'post',
  locale: Locale,
  slug?: string,
): string {
  if (routeKey === 'post') {
    const base = routes.blog[locale];
    return slug ? `${base}${slug}/` : base;
  }
  return routes[routeKey][locale];
}

export interface AlternateLink {
  locale: Locale;
  href: string;
  lang: string;
}

export function getAlternates(
  routeKey: RouteKey | 'post',
  slug?: string,
  availableLocales: Locale[] = [...locales],
): AlternateLink[] {
  return locales.map((loc) => {
    let href: string;
    if (availableLocales.includes(loc)) {
      href = path(routeKey, loc, slug);
    } else {
      // Fallback to section root if post/item not available in this locale
      href = routeKey === 'post' ? routes.blog[loc] : routes[routeKey][loc];
    }
    return {
      locale: loc,
      href,
      lang: bcp47[loc],
    };
  });
}

export function splitId(id: string): { locale: Locale; slug: string } {
  const parts = id.split('/');
  if (parts.length > 1 && locales.includes(parts[0] as Locale)) {
    return {
      locale: parts[0] as Locale,
      slug: parts.slice(1).join('/'),
    };
  }
  return {
    locale: defaultLocale,
    slug: id,
  };
}

export function formatDate(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(bcp47[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
