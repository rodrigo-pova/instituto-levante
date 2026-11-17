/**
 * Cloudflare Pages Functions - GitHub OAuth Shared Utilities
 */

export interface OAuthEnv {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_SCOPE?: string;
}

export function createStateToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function parseCookies(
  cookieHeader: string | null,
): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

export function createAuthorizeUrl(
  clientId: string,
  state: string,
  scope: string = 'public_repo',
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    scope,
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function renderSuccessHtml(
  token: string,
  provider: string = 'github',
): string {
  const payload = JSON.stringify({ token, provider });
  const rawMessage = `authorization:${provider}:success:${payload}`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Autorizado | Instituto Levante CMS</title>
    <style>
      body { font-family: system-ui, sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #fdfbf7; color: #1e2428; text-align: center; }
      .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #eb534a33; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      h1 { font-size: 1.25rem; color: #1c786a; margin-top: 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>✓ Autorização concluída</h1>
      <p>Conectando ao painel do Instituto Levante...</p>
    </div>
    <script>
      (function () {
        const msg = ${JSON.stringify(rawMessage)};
        const obj = ${payload};
        if (window.opener) {
          window.opener.postMessage(msg, window.location.origin);
          window.opener.postMessage(obj, window.location.origin);
          setTimeout(function() { window.close(); }, 600);
        } else {
          document.querySelector('p').textContent = 'Autenticado com sucesso. Você pode fechar esta aba.';
        }
      })();
    </script>
  </body>
</html>`;
}

export function renderErrorHtml(
  error: string,
  provider: string = 'github',
): string {
  const payload = JSON.stringify({ message: error, provider });
  const rawMessage = `authorization:${provider}:error:${payload}`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Erro de Autorização | Instituto Levante CMS</title>
    <style>
      body { font-family: system-ui, sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #fdfbf7; color: #1e2428; text-align: center; }
      .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #eb534a; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      h1 { font-size: 1.25rem; color: #d13b32; margin-top: 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Falha na Autenticação</h1>
      <p>${error}</p>
    </div>
    <script>
      (function () {
        const msg = ${JSON.stringify(rawMessage)};
        if (window.opener) {
          window.opener.postMessage(msg, window.location.origin);
          setTimeout(function() { window.close(); }, 3000);
        }
      })();
    </script>
  </body>
</html>`;
}

export async function exchangeCodeForToken(
  clientId: string,
  clientSecret: string,
  code: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetchFn('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'instituto-levante-auth',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!res.ok) {
      return { error: `GitHub OAuth HTTP error: ${res.status}` };
    }

    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (data.error) {
      return { error: data.error_description || data.error };
    }

    if (!data.access_token) {
      return { error: 'No access token returned by GitHub' };
    }

    return { token: data.access_token };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Token exchange network error: ${msg}` };
  }
}
