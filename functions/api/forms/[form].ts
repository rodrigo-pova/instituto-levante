/**
 * Cloudflare Pages Function: Form Submission Handler
 * Endpoint: POST /api/forms/contato | POST /api/forms/parcerias
 */

export interface FormEnv {
  RESEND_API_KEY?: string;
  NOTIFICATION_EMAIL?: string;
  FROM_EMAIL?: string;
}

export interface FormResult {
  status: number;
  redirectUrl?: string;
  error?: string;
  isSpam?: boolean;
}

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

export function getRedirectUrl(formName: string, locale: string): string {
  const isEn = locale === 'en';
  if (formName === 'parcerias') {
    return isEn ? '/en/partners/thank-you/' : '/parceiros/obrigado/';
  }
  return isEn ? '/en/contact/thank-you/' : '/contato/obrigado/';
}

export async function processFormSubmission(
  formName: string,
  formData: FormData,
  env: FormEnv = {},
  fetchFn: typeof fetch = fetch,
): Promise<FormResult> {
  const normalizedForm = formName.toLowerCase().trim();
  if (normalizedForm !== 'contato' && normalizedForm !== 'parcerias') {
    return { status: 404, error: `Form "${formName}" not found.` };
  }

  const locale = formData.get('locale') === 'en' ? 'en' : 'pt-br';
  const redirectUrl = getRedirectUrl(normalizedForm, locale);

  // Honeypot anti-spam check: if bot-field has any value, silently discard
  const botField = formData.get('bot-field');
  if (botField && String(botField).trim().length > 0) {
    return { status: 303, redirectUrl, isSpam: true };
  }

  // Basic validation
  if (normalizedForm === 'contato') {
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      return {
        status: 400,
        error: 'Por favor preencha nome, e-mail e mensagem.',
      };
    }
  } else if (normalizedForm === 'parcerias') {
    const company = formData.get('company')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();

    if (!company || !name || !email) {
      return {
        status: 400,
        error: 'Por favor preencha empresa, nome e e-mail corporativo.',
      };
    }
  }

  // Optional: Send email notification via Resend API
  if (env.RESEND_API_KEY) {
    try {
      const recipient =
        env.NOTIFICATION_EMAIL ||
        (normalizedForm === 'parcerias'
          ? 'parcerias@institutolevante.org.br'
          : 'contato@institutolevante.org.br');

      const fromAddress =
        env.FROM_EMAIL ||
        'Instituto Levante <notificacoes@institutolevante.org.br>';

      const entries = Array.from(formData.entries())
        .filter(([k]) => k !== 'bot-field')
        .map(
          ([k, v]) =>
            `<strong>${k}:</strong> ${String(v).replace(/</g, '&lt;')}`,
        )
        .join('<br />');

      const subject =
        normalizedForm === 'parcerias'
          ? `[Site Levante - Parceria] Nova proposta de ${formData.get('company') || formData.get('name')}`
          : `[Site Levante - Contato] Nova mensagem de ${formData.get('name')}`;

      await fetchFn('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipient],
          subject,
          html: `<div style="font-family:sans-serif;line-height:1.6;"><h2>${subject}</h2><p>${entries}</p></div>`,
        }),
      });
    } catch (emailErr) {
      // Log error but do not fail user experience
      console.error('Failed to send notification email via Resend:', emailErr);
    }
  }

  return { status: 303, redirectUrl, isSpam: false };
}

export const onRequestPost: PagesFunction<FormEnv, 'form'> = async (
  context,
) => {
  const formName = String(context.params.form || '');

  try {
    const formData = await context.request.formData();
    const result = await processFormSubmission(formName, formData, context.env);

    if (result.status === 303 && result.redirectUrl) {
      return new Response(null, {
        status: 303,
        headers: { Location: result.redirectUrl },
      });
    }

    return new Response(result.error || 'Erro no formulário.', {
      status: result.status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Form processing error:', err);
    return new Response('Erro interno ao processar formulário.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};

export const onRequest: PagesFunction<FormEnv, 'form'> = async (context) => {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
