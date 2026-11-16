import rawSettings from '../data/settings.json';
import { z } from 'astro/zod';
import { cleanAscii, normalizePixKey } from './pix';

export const settingsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  partnershipsEmail: z.string().email(),
  phone: z.string(),
  address: z.string(),
  classSchedule: z.string(),
  cnpj: z.string(),
  socials: z.object({
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }),
  crowdfundingUrl: z.string(),
  crowdfundingPlatform: z.string().optional(),
  pixKey: z.string(),
  pixKeyType: z.enum(['cnpj', 'email', 'phone', 'random']),
  pixReceiverName: z.string().min(1).max(25),
  pixCity: z.string().min(1).max(15),
  pixQrImage: z.string().optional(),
});

export type SiteSettings = z.infer<typeof settingsSchema>;

// Validate on load
const parsed = settingsSchema.safeParse(rawSettings);
if (!parsed.success) {
  console.error('Invalid settings.json configuration:', parsed.error.format());
  throw new Error('Invalid site configuration in src/data/settings.json');
}

export const settings: SiteSettings = {
  ...parsed.data,
  // Ensure ASCII constraints for PIX
  pixReceiverName: cleanAscii(parsed.data.pixReceiverName, 25),
  pixCity: cleanAscii(parsed.data.pixCity, 15),
  pixKey: normalizePixKey(parsed.data.pixKey, parsed.data.pixKeyType),
};
