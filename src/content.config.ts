import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const singleton = <T extends z.ZodTypeAny>(name: string, schema: T) =>
  defineCollection({
    loader: glob({ pattern: `*/${name}.yaml`, base: './src/content/pages' }),
    schema,
  });

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const tierKeyEnum = z.enum(['mantenedor', 'ouro', 'prata', 'apoiador']);
export type TierKey = z.infer<typeof tierKeyEnum>;

export const teamGroupEnum = z.enum(['founder', 'teacher', 'tutor', 'staff']);
export type TeamGroup = z.infer<typeof teamGroupEnum>;

export const orgCategoryEnum = z.enum([
  'sponsor',
  'institutional_partner',
  'supporter',
]);
export type OrgCategory = z.infer<typeof orgCategoryEnum>;

export const collections = {
  // 1. Home Page
  home: singleton(
    'home',
    z.object({
      hero: z.object({
        badge: z.string().optional(),
        title: z.string(),
        subtitle: z.string(),
        image: z.string().optional(),
        cta: ctaSchema,
        secondaryCta: ctaSchema.optional(),
      }),
      mission: z.object({
        tag: z.string().optional(),
        title: z.string(),
        body: z.string(),
      }),
      pillars: z.array(
        z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
          highlight: z.string().optional(),
        }),
      ),
      stats: z.array(
        z.object({
          value: z.string(),
          label: z.string(),
          sublabel: z.string().optional(),
        }),
      ),
      alumniCallout: z
        .object({
          badge: z.string(),
          title: z.string(),
          story: z.string(),
          cta: ctaSchema.optional(),
        })
        .optional(),
      sponsorBand: z.object({
        title: z.string(),
        cta: ctaSchema,
      }),
      donateBand: z.object({
        title: z.string(),
        body: z.string(),
        cta: ctaSchema,
      }),
    }),
  ),

  // 2. About Page
  about: singleton(
    'about',
    z.object({
      hero: z.object({
        title: z.string(),
        subtitle: z.string(),
        image: z.string().optional(),
      }),
      story: z.object({
        title: z.string(),
        body: z.string(),
      }),
      routine: z.object({
        title: z.string(),
        intro: z.string(),
        steps: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            time: z.string().optional(),
          }),
        ),
      }),
      values: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
  ),

  // 3. Team Page
  team: singleton(
    'team',
    z.object({
      title: z.string(),
      intro: z.string(),
      alumniSpotlight: z
        .object({
          enabled: z.boolean().default(true),
          badge: z.string(),
          title: z.string(),
          story: z.string(),
          quote: z.string().optional(),
          memberName: z.string().optional(),
          memberRole: z.string().optional(),
        })
        .optional(),
      groups: z.object({
        founder: z.string(),
        teacher: z.string(),
        tutor: z.string(),
        staff: z.string(),
      }),
      members: z.array(
        z.object({
          name: z.string(),
          role: z.string(),
          group: teamGroupEnum.default('staff'),
          photo: z.string().optional(),
          photoAlt: z.string().optional(),
          bio: z.string().optional(),
          isAlumni: z.boolean().default(false),
          alumniNote: z.string().optional(),
          order: z.number().default(0),
        }),
      ),
    }),
  ),

  // 4. Partners & Corporate Sponsorship Page
  partners: singleton(
    'partners',
    z.object({
      hero: z.object({
        badge: z.string().optional(),
        title: z.string(),
        subtitle: z.string(),
        primaryCta: ctaSchema,
        mediaKitPdf: z
          .object({
            label: z.string(),
            file: z.string(),
          })
          .optional(),
      }),
      whyPartner: z.object({
        title: z.string(),
        intro: z.string().optional(),
        items: z.array(
          z.object({
            title: z.string(),
            body: z.string(),
          }),
        ),
      }),
      incentiveFocus: z.object({
        badge: z.string(),
        title: z.string(),
        body: z.string(),
        steps: z.array(
          z.object({
            number: z.string(),
            title: z.string(),
            description: z.string(),
          }),
        ),
        callout: z.string().optional(),
      }),
      tiers: z.array(
        z.object({
          key: tierKeyEnum,
          name: z.string(),
          price: z.string().optional(),
          benefits: z.array(z.string()),
          highlighted: z.boolean().default(false),
        }),
      ),
      partnerGroups: z.object({
        sponsors: z.string(),
        institutional: z.string(),
        supporters: z.string(),
      }),
      testimonials: z
        .array(
          z.object({
            quote: z.string(),
            author: z.string(),
            role: z.string().optional(),
            company: z.string(),
          }),
        )
        .default([]),
      form: z.object({
        title: z.string(),
        intro: z.string(),
      }),
    }),
  ),

  // 5. Donate Page
  donate: singleton(
    'donate',
    z.object({
      title: z.string(),
      intro: z.string(),
      pix: z.object({
        title: z.string(),
        body: z.string(),
        securityNote: z.string().optional(),
      }),
      crowdfunding: z
        .object({
          title: z.string(),
          body: z.string(),
          buttonLabel: z.string(),
        })
        .optional(),
      international: z.object({
        badge: z.string().optional(),
        title: z.string(),
        body: z.string(),
        ctaLabel: z.string(),
        ctaHref: z.string(),
      }),
      impact: z.array(
        z.object({
          amount: z.string(),
          description: z.string(),
        }),
      ),
    }),
  ),

  // 6. Get Involved Page
  getInvolved: singleton(
    'get-involved',
    z.object({
      title: z.string(),
      intro: z.string(),
      ways: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          cta: ctaSchema,
        }),
      ),
    }),
  ),

  // 7. Transparency Page
  transparency: singleton(
    'transparency',
    z.object({
      title: z.string(),
      intro: z.string(),
      governanceNotes: z.string().optional(),
      reports: z.array(
        z.object({
          year: z.number(),
          title: z.string(),
          category: z.string().optional(),
          file: z.string(),
        }),
      ),
    }),
  ),

  // 8. Contact Page
  contactPage: singleton(
    'contact',
    z.object({
      title: z.string(),
      intro: z.string(),
      locationTitle: z.string().optional(),
      locationText: z.string().optional(),
    }),
  ),

  // 9. Blog Index Page
  blogPage: singleton(
    'blog',
    z.object({
      title: z.string(),
      intro: z.string(),
    }),
  ),

  // Non-translated collection: Organizations (Sponsors, Partners, Supporters)
  organizations: defineCollection({
    loader: glob({ pattern: '*.yaml', base: './src/content/organizations' }),
    schema: z.object({
      name: z.string(),
      logo: z.string(),
      url: z.string().url().optional(),
      category: orgCategoryEnum,
      tier: tierKeyEnum.optional(),
      active: z.boolean().default(true),
      order: z.number().default(0),
    }),
  }),

  // Translated folder collection: Blog posts
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      author: z.string().optional(),
      draft: z.boolean().default(false),
    }),
  }),
};
