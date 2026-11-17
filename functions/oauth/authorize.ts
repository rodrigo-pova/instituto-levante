import { createStateToken, createAuthorizeUrl, type OAuthEnv } from './_shared';

interface EventContext<Env, P extends string, Data> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Data;
}

type PagesFunction<
  Env = unknown,
  P extends string = string,
  Data = Record<string, unknown>,
> = (context: EventContext<Env, P, Data>) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<OAuthEnv> = async (context) => {
  const clientId = context.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      'GITHUB_CLIENT_ID environment variable is missing. Please configure it in the Cloudflare Pages dashboard.',
      {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      },
    );
  }

  const state = createStateToken();
  const scope = context.env.GITHUB_SCOPE || 'public_repo';
  const authorizeUrl = createAuthorizeUrl(clientId, state, scope);

  const headers = new Headers();
  headers.set('Location', authorizeUrl);
  headers.append(
    'Set-Cookie',
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/oauth; Max-Age=600`,
  );

  return new Response(null, {
    status: 302,
    headers,
  });
};
