// Only allow search engine indexing on main branch production builds
export const shouldIndex =
  !process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === 'main';
