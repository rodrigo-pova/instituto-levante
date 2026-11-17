# Guia de Implantação — Cloudflare Pages, GitHub OAuth e Domínio (`institutolevante.org.br`)

Este documento descreve o passo a passo completo para colocar o site institucional do **Instituto Levante** em produção usando **Cloudflare Pages** (plano gratuito com largura de banda ilimitada), **Sveltia CMS** autenticado via GitHub OAuth e **Resend** para entrega de formulários por e-mail.

---

## Visão Geral da Infraestrutura

```text
[Visitante / Editor]
       │
       ▼
[Cloudflare DNS + CDN (institutolevante.org.br)]
       ├── Páginas Estáticas (dist/*) ────────────► Astro 7 SSG (PT-BR & EN-US)
       ├── Painel CMS (/admin/*) ─────────────────► Sveltia CMS (CDN)
       ├── Login OAuth (/oauth/authorize, /redirect) ► Cloudflare Pages Function ──► GitHub API
       └── Formulários (/api/forms/contato, /parcerias) ► Cloudflare Pages Function ──► Resend API
```

- **Custo mensal recorrente de hospedagem:** **R$ 0,00** (Cloudflare Pages Free + GitHub Free + Resend Free até 3.000 e-mails/mês).
- **Manutenção:** Zero servidores para atualizar e **sem tokens PAT anuais** — o login do painel usa um **GitHub OAuth App** oficial integrado às Cloudflare Pages Functions do próprio repositório (`functions/oauth/*`).

---

## Passo 1 — Criar a Conta Institucional Compartilhada no GitHub

Para que os editores do Instituto Levante acessem `/admin` de forma simples e sem manutenção anual de tokens:

1. Crie uma conta gratuita no GitHub usando o e-mail institucional, por exemplo:
   - **Usuário:** `instituto-levante-editor` (ou `institutolevante`)
   - **E-mail:** `contato@institutolevante.org.br`
2. Ative a autenticação de dois fatores (2FA) e compartilhe o acesso com os responsáveis do instituto via gerenciador de senhas compartilhado (ex.: Bitwarden / 1Password).
3. No repositório principal do site (`rodrigo-pova/instituto-levante` ou organização oficial), vá em **Settings → Collaborators** e adicione a conta institucional com permissão **Write** (escrita).
4. Verifique em `public/admin/config.yml` se o campo `backend.repo` corresponde ao nome exato do repositório:
   ```yaml
   backend:
     name: github
     repo: rodrigo-pova/instituto-levante
     branch: main
     base_url: https://institutolevante.org.br
     auth_endpoint: oauth/authorize
   ```

---

## Passo 2 — Criar o GitHub OAuth App (para o `/admin`)

O Sveltia CMS usa as rotas `/oauth/authorize` e `/oauth/redirect` (já incluídas na pasta `functions/oauth/`) para autenticar no GitHub:

1. Acesse no GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App** (pode ser criado na sua conta ou na conta institucional).
2. Preencha os campos:
   - **Application name:** `Instituto Levante CMS`
   - **Homepage URL:** `https://institutolevante.org.br`
   - **Authorization callback URL:** `https://institutolevante.org.br/oauth/redirect`
3. Clique em **Register application**.
4. Copie o **Client ID** gerado.
5. Clique em **Generate a new client secret** e copie imediatamente o **Client Secret** (você usará ambos no Passo 4).

---

## Passo 3 — Criar o Projeto no Cloudflare Pages

1. Acesse o painel da [Cloudflare](https://dash.cloudflare.com/) e vá em **Compute (Workers & Pages) → Create → Pages → Connect to Git**.
2. Autorize o GitHub e selecione o repositório `instituto-levante`.
3. Configure os parâmetros de build:
   - **Project name:** `instituto-levante`
   - **Production branch:** `main`
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Em **Environment variables (Build)**, confirme que a versão do Node é `22` (o arquivo `.nvmrc` na raiz já define `22`, mas você também pode definir `NODE_VERSION = 22`).
5. Clique em **Save and Deploy**.

---

## Passo 4 — Configurar as Variáveis de Ambiente (Runtime / Functions)

No painel do projeto dentro do Cloudflare Pages, acesse **Settings → Environment variables** e adicione as seguintes variáveis (tanto para **Production** quanto para **Preview**):

| Variável               | Tipo                   | Descrição / Exemplo                                                                                                        |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_CLIENT_ID`     | Texto                  | Client ID do GitHub OAuth App criado no Passo 2                                                                            |
| `GITHUB_CLIENT_SECRET` | Secret (Criptografado) | Client Secret do GitHub OAuth App criado no Passo 2                                                                        |
| `GITHUB_SCOPE`         | Texto (Opcional)       | Padrão: `public_repo` (use `repo` caso o repositório seja privado)                                                         |
| `RESEND_API_KEY`       | Secret (Criptografado) | Chave de API do Resend (`re_...`) para envio de e-mails dos formulários                                                    |
| `NOTIFICATION_EMAIL`   | Texto (Opcional)       | E-mail de destino dos alertas (padrão automático: `contato@institutolevante.org.br` e `parcerias@institutolevante.org.br`) |
| `FROM_EMAIL`           | Texto (Opcional)       | Remetente verificado no Resend (padrão: `Instituto Levante <notificacoes@institutolevante.org.br>`)                        |

> Após salvar as variáveis de ambiente, faça um novo deploy (**Deployments → Retry deployment**) para que as Pages Functions carreguem os valores.

---

## Passo 5 — Configurar o Resend para os Formulários

Os formulários de **Contato** (`/api/forms/contato`) e **Parcerias** (`/api/forms/parcerias`) contam com proteção anti-spam via campo _honeypot_ (`bot-field`) e redirecionam imediatamente o visitante para as páginas de agradecimento (`/contato/obrigado/`, `/parceiros/obrigado/` e equivalentes em inglês).

Para receber os dados preenchidos por e-mail:

1. Crie uma conta gratuita em [resend.com](https://resend.com/).
2. Em **Domains → Add Domain**, adicione `institutolevante.org.br` e crie os registros DNS (`DKIM` / `SPF`) no painel de DNS da Cloudflare.
3. Em **API Keys → Create API Key**, gere uma chave com permissão de envio (`Sending access`) e salve-a na variável `RESEND_API_KEY` do Cloudflare Pages (Passo 4).

---

## Passo 6 — Apontar o Domínio `institutolevante.org.br` e Ativar Analytics

1. No projeto do Cloudflare Pages, vá em **Custom domains → Set up a custom domain**.
2. Digite `institutolevante.org.br` (e opcionalmente `www.institutolevante.org.br`).
3. Se a zona DNS do domínio já estiver na Cloudflare (com os servidores NS do Registro.br apontados para a Cloudflare), os registros `CNAME` e o certificado SSL/TLS serão configurados com 1 clique.
4. Para ativar estatísticas de acesso gratuitas e sem cookies de rastreamento:
   - No menu lateral do Cloudflare Pages, vá em **Metrics / Web Analytics** e clique em **Enable Web Analytics** para o site `institutolevante.org.br`.
   - Opcionalmente, caso utilize **Umami** ou **Plausible**, basta definir `PUBLIC_UMAMI_WEBSITE_ID` ou `PUBLIC_PLAUSIBLE_DOMAIN` nas variáveis de ambiente — todos os botões de conversão (`pix-copy-key`, `pix-copy-code`, `donate-benfeitoria`, `partner-lead-submit`, `media-kit-download`, `contact-submit`) já possuem atributos `data-track` prontos.
