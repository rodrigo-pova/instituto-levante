# Instituto Levante — Site Institucional (`institutolevante.org.br`)

Site institucional bilíngue (**Português `pt-BR`** e **Inglês `en-US`**) do **Instituto Levante**, organização sem fins lucrativos do Rio de Janeiro que promove esporte, alimentação nutritiva, leitura e acesso à cultura para crianças e adolescentes por meio de aulas gratuitas de vôlei de praia em Ipanema (Posto 8 / 9).

---

## Sumário

1. [Arquitetura e Stack Tecnológica](#1-arquitetura-e-stack-tecnológica)
2. [Mapa de Rotas Bilíngues](#2-mapa-de-rotas-bilíngues)
3. [Identidade Visual e Acessibilidade (WCAG AA/AAA)](#3-identidade-visual-e-acessibilidade-wcag-aaaaa)
4. [Estrutura de Pastas e Modelo de Conteúdo](#4-estrutura-de-pastas-e-modelo-de-conteúdo)
5. [Comandos de Desenvolvimento e Testes](#5-comandos-de-desenvolvimento-e-testes)
6. [Checklist de Pré-Lançamento](#6-checklist-de-pré-lançamento)
7. [Documentação Complementar](#7-documentação-complementar)

---

## 1. Arquitetura e Stack Tecnológica

| Camada                      | Tecnologia                                                              | Motivo da Escolha                                                                                                              |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Gerador Estático (SSG)**  | [Astro 7](https://astro.build/) + TypeScript                            | HTML estático puro (zero JS desnecessário no cliente), Content Collections tipadas com Zod e i18n nativo                       |
| **Estilização**             | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/typography` | Design system customizado via `@theme` com contraste verificado                                                                |
| **CMS (Painel de Edição)**  | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) em `/admin`       | Suporte nativo a i18n lado a lado (`multiple_folders`) e escrita direta no GitHub via OAuth                                    |
| **Hospedagem e Serverless** | [Cloudflare Pages](https://pages.cloudflare.com/) + Pages Functions     | CDN global gratuita, bandwidth ilimitado, funções serverless integradas para OAuth (`/oauth/*`) e formulários (`/api/forms/*`) |
| **Doação PIX**              | Gerador BR Code EMV estático (`src/lib/pix.ts`) + `qrcode`              | Gera o QR Code `<svg>` e o código _PIX Copia e Cola_ (CRC16-CCITT) em tempo de build, sem depender de APIs externas            |
| **Testes Automatizados**    | [Vitest](https://vitest.dev/)                                           | 35 testes cobrindo rotas i18n, payload PIX, paridade de conteúdo PT/EN, Pages Functions e integridade do build `dist/`         |

---

## 2. Mapa de Rotas Bilíngues

O idioma padrão é `pt-BR` (sem prefixo na URL) e o inglês `en-US` fica sob `/en/`. Todas as páginas possuem tags `<link rel="alternate" hreflang="...">` simétricas e seletor de idioma no cabeçalho que mantém o usuário na página equivalente:

| Chave de Rota    | Português (`pt-BR`)          | Inglês (`en-US`)                   | Finalidade Principal                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`           | `/`                          | `/en/`                             | Apresentação dos 4 pilares (vôlei 2x/semana, lanche nutritivo, biblioteca e passeios culturais), indicadores de impacto, chamada de ex-aluno e CTAs                                                                                                        |
| `about`          | `/sobre/`                    | `/en/about/`                       | História de 4 anos do projeto, rotina completa das aulas na praia (terças e quintas) e valores institucionais                                                                                                                                              |
| `team`           | `/equipe/`                   | `/en/team/`                        | Destaque de trajetória de ex-aluno(a) na equipe e grade de membros dividida em **Fundadores (`founder`)**, **Professores (`teacher`)**, **Tutores (`tutor`)** e **Equipe Geral (`staff`)**, com suporte opcional a fotos e selo **"Ex-aluno(a) / Alumni"** |
| `partners`       | `/parceiros/`                | `/en/partners/`                    | Página unificada de Parcerias e Patrocínio Corporativo: **Lei de Incentivo ao Esporte (LIE)** em PT, **International Grants & ESG** em EN, cotas de patrocínio (com preço opcional), vitrine de patrocinadores/parceiros e formulário corporativo          |
| `partnersThanks` | `/parceiros/obrigado/`       | `/en/partners/thank-you/`          | Confirmação de envio do formulário de parcerias                                                                                                                                                                                                            |
| `donate`         | `/doe/`                      | `/en/donate/`                      | Doação via **PIX** (QR Code SVG gerado no build + botões de copiar chave e Copia e Cola), card opcional de **Crowdfunding** (Vakinha / Benfeitoria — oculto automaticamente quando vazio) e card de **Doação Internacional**                               |
| `getInvolved`    | `/participe/`                | `/en/get-involved/`                | Voluntariado, doação de livros/materiais esportivos e convites culturais/teatrais                                                                                                                                                                          |
| `transparency`   | `/transparencia/`            | `/en/transparency/`                | Notas de governança e relatórios anuais / prestações de contas em PDF                                                                                                                                                                                      |
| `contact`        | `/contato/`                  | `/en/contact/`                     | Informações de atendimento, horário/local na Praia de Ipanema e formulário de contato                                                                                                                                                                      |
| `contactThanks`  | `/contato/obrigado/`         | `/en/contact/thank-you/`           | Confirmação de envio do formulário de contato                                                                                                                                                                                                              |
| `blog`           | `/blog/` (+ `/blog/rss.xml`) | `/en/blog/` (+ `/en/blog/rss.xml`) | Notícias, relatos de idas ao teatro e cobertura do torneio de aniversário                                                                                                                                                                                  |

---

## 3. Identidade Visual e Acessibilidade (WCAG AA/AAA)

A paleta oficial do Instituto Levante foi combinada com **Deep Charcoal (`#1E2428`)** e variações acessíveis (`coral-600`, `mint-700`) em `src/styles/global.css` para preservar a energia solar do mídia kit sem comprometer a legibilidade:

- **Superfície Principal:** Branco `#FFFFFF` e Areia Suave `#FDFBF7` com texto Charcoal `#1E2428` (**15.7 : 1 — WCAG AAA**).
- **Coral Oficial (`#EB534A`) & Coral Acessível (`#D13B32`):** Coral oficial nos cabeçalhos Hero e faixas de impacto; `#D13B32` em botões primários com texto branco (**4.79 : 1 — WCAG AA**).
- **Mint Oficial (`#5BC6B5`) & Deep Mint (`#1C786A`):** Mint oficial sempre pareado com texto Charcoal (**7.61 : 1 — WCAG AAA**); `#1C786A` para textos de destaque e ícones sobre fundo claro (**5.32 : 1 — WCAG AA**).
- **Amarelo Sol (`#F6C944`):** Sempre com texto Charcoal (**9.98 : 1 — WCAG AAA**), usado no botão **"Doe / Donate"** do topo e nos selos **"Ex-aluno(a) / Alumni"**.
- **Lilás (`#CB9BD5`):** Sempre com texto Charcoal (**6.87 : 1 — WCAG AA+**), usado em destaques de cultura, teatro e biblioteca.

---

## 4. Estrutura de Pastas e Modelo de Conteúdo

```text
├── functions/
│   ├── api/forms/[form].ts       # Handler POST para /api/forms/contato e /api/forms/parcerias
│   └── oauth/                    # Handler GitHub OAuth para login no Sveltia CMS (/oauth/authorize, /oauth/redirect)
├── public/
│   ├── _headers                  # Headers de segurança e X-Robots-Tag noindex para /admin/*
│   ├── _redirects                # Redirecionamentos Cloudflare Pages
│   ├── admin/                    # Painel Sveltia CMS (index.html + config.yml)
│   └── uploads/                  # Fotos, logos de parceiros e PDFs de transparência/mídia kit
├── src/
│   ├── components/               # Componentes Astro (Header, Footer, TeamGrid, PixDonation, etc.)
│   ├── content/
│   │   ├── blog/{pt-br,en}/      # Artigos do blog em Markdown (.md)
│   │   ├── organizations/        # Patrocinadores, parceiros institucionais e apoiadores (.yaml)
│   │   └── pages/{pt-br,en}/     # 9 páginas fixas em cada idioma (18 arquivos .yaml)
│   ├── data/settings.json        # Dados globais (e-mails, CNPJ, chave PIX, link opcional de crowdfunding)
│   ├── i18n/                     # Configuração de idiomas, mapa de rotas e dicionário de UI
│   ├── layouts/BaseLayout.astro  # Layout base com SEO, Open Graph e skip-link de acessibilidade
│   ├── lib/                      # Gerador PIX (pix.ts), leitor de coleções (content.ts) e validação de settings
│   ├── pages/                    # Rotas em pt-BR (raiz) e en-US (src/pages/en/)
│   ├── styles/global.css         # Tema Tailwind v4 e tokens de cor
│   └── views/                    # Views compartilhadas entre as rotas PT e EN
└── tests/                        # Suítes Vitest (i18n, pix, content-parity, functions, dist)
```

---

## 5. Comandos de Desenvolvimento e Testes

**Pré-requisito:** Node.js `>= 22.23` (veja `.nvmrc`).

```bash
# Instalar dependências
npm install

# Iniciar servidor local de desenvolvimento (http://localhost:4321)
npm run dev

# Verificar tipagem TypeScript, Astro e schemas de conteúdo
npm run check

# Gerar build estático de produção em dist/
npm run build

# Executar todas as 5 suítes de testes automatizados (Vitest)
npm test

# Verificar formatação de código (Prettier)
npm run lint

# Formatar todos os arquivos automaticamente
npm run format
```

---

## 6. Checklist de Pré-Lançamento

Antes de apontar o domínio definitivo `institutolevante.org.br`, revise os seguintes itens pelo painel `/admin` ou diretamente nos arquivos do repositório:

- [ ] **Configurações Gerais e PIX (`src/data/settings.json`):**
  - Substituir o CNPJ, telefone/WhatsApp e e-mails de exemplo pelos dados definitivos do instituto.
  - Configurar a chave PIX oficial (`pixKey`, `pixKeyType`, `pixReceiverName` sem acentos até 25 caracteres, `pixCity` até 15 caracteres) e testar a leitura do QR Code gerado em `/doe/` no aplicativo de pelo menos dois bancos.
  - Se houver uma campanha ativa na **Benfeitoria** ou **Vakinha**, preencher `crowdfundingUrl` e `crowdfundingPlatform` (caso contrário, manter `crowdfundingUrl: ""` para ocultar o card automaticamente).
- [ ] **Equipe (`src/content/pages/{pt-br,en}/team.yaml`):**
  - Revisar nomes, cargos, minibiografias e grupos (`founder`, `teacher`, `tutor`, `staff`).
  - Enviar fotos reais da equipe (ou deixar o campo `photo` em branco para os membros que preferirem exibir o avatar com iniciais) e confirmar o selo `isAlumni: true` nos ex-alunos que hoje atuam na equipe.
- [ ] **Parceiros e Transparência (`src/content/organizations/` e `transparency.yaml`):**
  - Substituir os logos demonstrativos em `public/uploads/logos/` pelos logos oficiais dos patrocinadores e parceiros culturais.
  - Substituir os PDFs demonstrativos em `public/uploads/docs/` pelo Estatuto Social, relatórios anuais, certidões e Mídia Kit oficiais.
- [ ] **Infraestrutura Cloudflare Pages (`docs/setup-cloudflare.md`):**
  - Configurar `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` no Cloudflare Pages para liberar o login no `/admin`.
  - Configurar `RESEND_API_KEY`, `NOTIFICATION_EMAIL` e `FROM_EMAIL` para envio por e-mail dos formulários de contato e parceria.

---

## 7. Documentação Complementar

- **[Guia do Editor (`docs/guia-do-editor.md`)](docs/guia-do-editor.md):** Manual passo a passo em português para a equipe do Instituto Levante editar textos, gerenciar a página de equipe/ex-alunos, publicar notícias no blog e atualizar documentos pelo painel `/admin`.
- **[Guia de Implantação no Cloudflare Pages (`docs/setup-cloudflare.md`)](docs/setup-cloudflare.md):** Passo a passo técnico para criar a conta institucional compartilhada no GitHub, configurar o GitHub OAuth App, publicar no Cloudflare Pages, ativar o Resend e apontar o domínio `institutolevante.org.br`.
