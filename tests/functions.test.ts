import { describe, it, expect, vi } from 'vitest';
import {
  createStateToken,
  parseCookies,
  createAuthorizeUrl,
  renderSuccessHtml,
  renderErrorHtml,
  exchangeCodeForToken,
} from '../functions/oauth/_shared';
import {
  getRedirectUrl,
  processFormSubmission,
} from '../functions/api/forms/[form]';

describe('Cloudflare Pages Functions - OAuth Handler', () => {
  it('generates unique state tokens', () => {
    const s1 = createStateToken();
    const s2 = createStateToken();
    expect(s1).toBeDefined();
    expect(typeof s1).toBe('string');
    expect(s1.length).toBeGreaterThan(10);
    expect(s1).not.toBe(s2);
  });

  it('parses cookie headers accurately', () => {
    expect(parseCookies(null)).toEqual({});
    expect(parseCookies('')).toEqual({});
    expect(parseCookies('oauth_state=abc-123')).toEqual({
      oauth_state: 'abc-123',
    });
    expect(
      parseCookies('oauth_state=abc-123; session=xyz-456; theme=dark'),
    ).toEqual({
      oauth_state: 'abc-123',
      session: 'xyz-456',
      theme: 'dark',
    });
  });

  it('constructs a valid GitHub authorize URL', () => {
    const urlStr = createAuthorizeUrl(
      'gh-client-id-test',
      'state-token-xyz',
      'public_repo',
    );
    const url = new URL(urlStr);
    expect(url.origin).toBe('https://github.com');
    expect(url.pathname).toBe('/login/oauth/authorize');
    expect(url.searchParams.get('client_id')).toBe('gh-client-id-test');
    expect(url.searchParams.get('state')).toBe('state-token-xyz');
    expect(url.searchParams.get('scope')).toBe('public_repo');
  });

  it('renders success and error postMessage HTML templates', () => {
    const successHtml = renderSuccessHtml('gho_secret_token_123');
    expect(successHtml).toContain('authorization:github:success:');
    expect(successHtml).toContain('gho_secret_token_123');
    expect(successHtml).toContain('window.opener.postMessage');

    const errorHtml = renderErrorHtml('Invalid state token');
    expect(errorHtml).toContain('authorization:github:error:');
    expect(errorHtml).toContain('Invalid state token');
    expect(errorHtml).toContain('Falha na Autenticação');
  });

  it('exchanges code for token using fetch', async () => {
    const mockFetchSuccess = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'gho_real_token_xyz',
        scope: 'public_repo',
      }),
    });

    const successResult = await exchangeCodeForToken(
      'id',
      'secret',
      'code123',
      mockFetchSuccess as unknown as typeof fetch,
    );
    expect(successResult).toEqual({ token: 'gho_real_token_xyz' });

    const mockFetchError = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        error: 'bad_verification_code',
        error_description: 'Code expired',
      }),
    });

    const errorResult = await exchangeCodeForToken(
      'id',
      'secret',
      'badcode',
      mockFetchError as unknown as typeof fetch,
    );
    expect(errorResult.error).toBe('Code expired');
  });
});

describe('Cloudflare Pages Functions - Forms Handler', () => {
  it('resolves correct redirect URLs for localized forms', () => {
    expect(getRedirectUrl('contato', 'pt-br')).toBe('/contato/obrigado/');
    expect(getRedirectUrl('contato', 'en')).toBe('/en/contact/thank-you/');
    expect(getRedirectUrl('parcerias', 'pt-br')).toBe('/parceiros/obrigado/');
    expect(getRedirectUrl('parcerias', 'en')).toBe('/en/partners/thank-you/');
  });

  it('rejects unknown form endpoints with 404', async () => {
    const fd = new FormData();
    const result = await processFormSubmission('unknown-form', fd);
    expect(result.status).toBe(404);
  });

  it('detects honeypot bots and silently redirects', async () => {
    const fd = new FormData();
    fd.append('bot-field', 'I am a spam bot');
    fd.append('locale', 'pt-br');

    const mockFetch = vi.fn();
    const result = await processFormSubmission(
      'contato',
      fd,
      {},
      mockFetch as unknown as typeof fetch,
    );

    expect(result.status).toBe(303);
    expect(result.isSpam).toBe(true);
    expect(result.redirectUrl).toBe('/contato/obrigado/');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('validates required fields for contact and partnership forms', async () => {
    const fdEmpty = new FormData();
    fdEmpty.append('locale', 'pt-br');

    const contactRes = await processFormSubmission('contato', fdEmpty);
    expect(contactRes.status).toBe(400);

    const partnerRes = await processFormSubmission('parcerias', fdEmpty);
    expect(partnerRes.status).toBe(400);
  });

  it('processes valid contact submission and notifies Resend if configured', async () => {
    const fd = new FormData();
    fd.append('name', 'Marina Silva');
    fd.append('email', 'marina@example.com');
    fd.append('subject', 'Voluntariado');
    fd.append('message', 'Gostaria de apoiar nos treinos de vôlei na praia.');
    fd.append('locale', 'pt-br');

    let sentPayload: any = null;
    const mockFetch = vi.fn().mockImplementation(async (_url, options) => {
      sentPayload = JSON.parse(options.body);
      return { ok: true, json: async () => ({ id: 'email_123' }) };
    });

    const env = {
      RESEND_API_KEY: 're_test_key_123',
      NOTIFICATION_EMAIL: 'contato@institutolevante.org.br',
    };

    const result = await processFormSubmission(
      'contato',
      fd,
      env,
      mockFetch as unknown as typeof fetch,
    );

    expect(result.status).toBe(303);
    expect(result.redirectUrl).toBe('/contato/obrigado/');
    expect(result.isSpam).toBe(false);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(sentPayload).toBeDefined();
    expect(sentPayload.to).toEqual(['contato@institutolevante.org.br']);
    expect(sentPayload.html).toContain('Marina Silva');
    expect(sentPayload.html).toContain('marina@example.com');
  });
});
