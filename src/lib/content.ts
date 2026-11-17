import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/config';
import { splitId } from '@/i18n/utils';
import type { OrgCategory, TierKey } from '@/content.config';

export type PageCollectionKey =
  | 'home'
  | 'about'
  | 'team'
  | 'partners'
  | 'donate'
  | 'getInvolved'
  | 'transparency'
  | 'contactPage'
  | 'blogPage';

/**
 * Loads a singleton page entry for a specific locale.
 * Throws at build time if the entry is missing.
 */
export async function getPage<C extends PageCollectionKey>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>> {
  // Collection singletons are loaded with pattern `*/name.yaml`
  // so the entry id is `<locale>/<name>`
  const fileMap: Record<PageCollectionKey, string> = {
    home: 'home',
    about: 'about',
    team: 'team',
    partners: 'partners',
    donate: 'donate',
    getInvolved: 'get-involved',
    transparency: 'transparency',
    contactPage: 'contact',
    blogPage: 'blog',
  };

  const id = `${locale}/${fileMap[collection]}`;
  const entry = (await getEntry(collection as 'home', id)) as
    CollectionEntry<C> | undefined;

  if (!entry) {
    throw new Error(
      `[Content Error] Missing singleton entry for collection "${collection}" at "${id}". Every page must have both pt-br and en files.`,
    );
  }

  return entry;
}

/**
 * Loads all blog posts for a specific locale, sorted newest first.
 * In production, draft posts are excluded.
 */
export async function getPosts(locale: Locale) {
  const isProd = import.meta.env.PROD;
  const allPosts = await getCollection('blog');

  return allPosts
    .filter((post) => {
      const { locale: postLocale } = splitId(post.id);
      if (postLocale !== locale) return false;
      if (isProd && post.data.draft) return false;
      return true;
    })
    .map((post) => {
      const { slug } = splitId(post.id);
      return {
        ...post,
        slug,
      };
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Retrieves a single post by slug and locale.
 */
export async function getPostBySlug(slug: string, locale: Locale) {
  const posts = await getPosts(locale);
  return posts.find((p) => p.slug === slug);
}

/**
 * Loads organizations, optionally filtered by category and active status.
 * Sorts sponsors by tier priority, then by custom order.
 */
const tierPriority: Record<TierKey, number> = {
  mantenedor: 1,
  ouro: 2,
  prata: 3,
  apoiador: 4,
};

export async function getOrganizations(options?: {
  category?: OrgCategory;
  activeOnly?: boolean;
}) {
  const { category, activeOnly = true } = options ?? {};
  const allOrgs = await getCollection('organizations');

  return allOrgs
    .filter((org) => {
      if (activeOnly && !org.data.active) return false;
      if (category && org.data.category !== category) return false;
      return true;
    })
    .sort((a, b) => {
      // If both are sponsors with tiers, sort by tier priority
      if (a.data.tier && b.data.tier) {
        const diff = tierPriority[a.data.tier] - tierPriority[b.data.tier];
        if (diff !== 0) return diff;
      }
      return a.data.order - b.data.order;
    });
}
