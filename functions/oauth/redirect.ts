import {
  parseCookies,
  exchangeCodeForToken,
  renderSuccessHtml,
  renderErrorHtml,
  type OAuthEnv,
} from './_shared';

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
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookies = parseCookies(context.request.headers.get('Cookie'));
  const storedState = cookies['oauth_state'];

  const clearCookieHeader =
    'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/oauth; Max-Age=0';

  if (!state || !storedState || state !== storedState) {
    return new Response(
      renderErrorHtml(
        'Sessão expirada ou estado CSRF inválido. Por favor tente novamente.',
      ),
      {
        status: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': clearCookieHeader,
        },
      },
    );
  }

  if (!code) {
    return new Response(
      renderErrorHtml('Código de autorização não recebido do GitHub.'),
      {
        status: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': clearCookieHeader,
        },
      },
    );
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      renderErrorHtml(
        'Credenciais do GitHub OAuth não configuradas no servidor.',
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': clearCookieHeader,
        },
      },
    );
  }

  const result = await exchangeCodeForToken(clientId, clientSecret, code);

  if (result.error || !result.token) {
    return new Response(
      renderErrorHtml(
        result.error || 'Erro ao trocar código por token com o GitHub.',
      ),
      {
        status: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': clearCookieHeader,
        },
      },
    );
  }

  return new Response(renderSuccessHtml(result.token), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': clearCookieHeader,
    },
  });
};
