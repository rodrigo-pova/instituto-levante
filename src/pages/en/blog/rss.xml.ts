import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPage, getPosts } from '@/lib/content';
import { settings } from '@/lib/settings';

export async function GET(context: APIContext) {
  const blogPage = await getPage('blogPage', 'en');
  const posts = await getPosts('en');

  return rss({
    title: `${settings.name} — ${blogPage.data.title}`,
    description: blogPage.data.intro,
    site: context.site ?? 'https://institutolevante.org.br',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/en/blog/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
