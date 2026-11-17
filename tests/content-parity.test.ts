import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'yaml';

const rootDir = resolve(__dirname, '..');
const ptPagesDir = resolve(rootDir, 'src/content/pages/pt-br');
const enPagesDir = resolve(rootDir, 'src/content/pages/en');
const orgsDir = resolve(rootDir, 'src/content/organizations');
const configPath = resolve(rootDir, 'public/admin/config.yml');

const validGroups = ['founder', 'teacher', 'tutor', 'staff'] as const;
const validTiers = ['mantenedor', 'ouro', 'prata', 'apoiador'] as const;
const validCategories = [
  'sponsor',
  'institutional_partner',
  'supporter',
] as const;

describe('Content Parity & Schema Integrity', () => {
  it('has identical page singletons in pt-br and en folders', () => {
    const ptFiles = readdirSync(ptPagesDir)
      .filter((f) => f.endsWith('.yaml'))
      .sort();
    const enFiles = readdirSync(enPagesDir)
      .filter((f) => f.endsWith('.yaml'))
      .sort();

    expect(ptFiles).toEqual(enFiles);
    expect(ptFiles.length).toBe(9);
    expect(ptFiles).toContain('home.yaml');
    expect(ptFiles).toContain('about.yaml');
    expect(ptFiles).toContain('team.yaml');
    expect(ptFiles).toContain('partners.yaml');
    expect(ptFiles).toContain('donate.yaml');
    expect(ptFiles).toContain('get-involved.yaml');
    expect(ptFiles).toContain('transparency.yaml');
    expect(ptFiles).toContain('contact.yaml');
    expect(ptFiles).toContain('blog.yaml');
  });

  it('validates team members and alumni support with and without photos', () => {
    const ptTeam = yaml.parse(
      readFileSync(resolve(ptPagesDir, 'team.yaml'), 'utf-8'),
    );
    const enTeam = yaml.parse(
      readFileSync(resolve(enPagesDir, 'team.yaml'), 'utf-8'),
    );

    expect(Array.isArray(ptTeam.members)).toBe(true);
    expect(Array.isArray(enTeam.members)).toBe(true);
    expect(ptTeam.members.length).toBe(enTeam.members.length);

    // Verify alumni exists in the team
    const ptAlumni = ptTeam.members.filter(
      (m: { isAlumni?: boolean }) => m.isAlumni === true,
    );
    expect(ptAlumni.length).toBeGreaterThanOrEqual(1);

    // Verify all team members have valid groups
    for (const member of ptTeam.members) {
      expect(validGroups).toContain(member.group);
      expect(typeof member.name).toBe('string');
      expect(typeof member.role).toBe('string');
      // Photos can be present or optional
      if (member.photo) {
        expect(typeof member.photo).toBe('string');
      }
    }
  });

  it('validates organizations category and tiers', () => {
    const orgFiles = readdirSync(orgsDir).filter((f) => f.endsWith('.yaml'));
    expect(orgFiles.length).toBeGreaterThan(0);

    for (const file of orgFiles) {
      const org = yaml.parse(readFileSync(resolve(orgsDir, file), 'utf-8'));
      expect(typeof org.name).toBe('string');
      expect(validCategories).toContain(org.category);
      if (org.tier) {
        expect(validTiers).toContain(org.tier);
      }
    }
  });

  it('validates public/admin/config.yml structure and collection paths', () => {
    expect(existsSync(configPath)).toBe(true);
    const configContent = readFileSync(configPath, 'utf-8');
    const config = yaml.parse(configContent);

    expect(config.backend.name).toBe('github');
    expect(config.backend.repo).toBe('rodrigo-pova/instituto-levante');
    expect(config.i18n.locales).toEqual(['pt-br', 'en']);
    expect(config.i18n.default_locale).toBe('pt-br');

    // Verify collections
    const collections = config.collections as Array<{
      name: string;
      files?: Array<{ name: string; file: string }>;
    }>;
    const collectionNames = collections.map((c) => c.name);
    expect(collectionNames).toContain('pages');
    expect(collectionNames).toContain('organizations');
    expect(collectionNames).toContain('blog');
    expect(collectionNames).toContain('settings');

    // Verify files in pages collection map to actual files
    const pagesCol = collections.find((c) => c.name === 'pages');
    expect(pagesCol).toBeDefined();
    expect(pagesCol?.files?.length).toBe(9);

    for (const f of pagesCol?.files || []) {
      const ptFilePath = resolve(rootDir, f.file.replace('{locale}', 'pt-br'));
      const enFilePath = resolve(rootDir, f.file.replace('{locale}', 'en'));
      expect(existsSync(ptFilePath), `Missing PT file: ${ptFilePath}`).toBe(
        true,
      );
      expect(existsSync(enFilePath), `Missing EN file: ${enFilePath}`).toBe(
        true,
      );
    }
  });
});
