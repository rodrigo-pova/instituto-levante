# Guia do Editor — Painel de Conteúdo do Instituto Levante

Bem-vindo(a) ao guia de administração do site do **Instituto Levante** (`institutolevante.org.br`). Este manual foi preparado para que qualquer pessoa da equipe possa atualizar textos, fotos, integrantes da equipe, notícias do blog, relatórios de transparência e dados de doação sem precisar mexer em código.

---

## 1. Como entrar no Painel de Administração (`/admin`)

1. No navegador (computador ou celular), acesse:
   **`https://institutolevante.org.br/admin/`**
2. Clique no botão **"Sign in with GitHub"** (Entrar com GitHub).
3. Na janela que se abrir, entre com a **conta institucional do Instituto Levante no GitHub** (usuário, senha e código de verificação de 2 fatores, se solicitado).
4. Após autorizar, a janela fechará sozinha e o painel de conteúdo será carregado.

> **Importante:** Toda alteração salva no painel gera uma atualização automática no site. Após clicar em **Salvar (Save)** no canto superior direito, o site público leva cerca de **1 a 2 minutos** para publicar a nova versão.

---

## 2. Como funciona a edição em Português e Inglês

O site do Instituto Levante é totalmente bilíngue (**Português `pt-BR`** e **Inglês `en`**):

- Ao abrir qualquer página ou notícia do blog, você verá no topo do editor um seletor de idiomas (**`PT-BR`** e **`EN`**), podendo visualizar os dois idiomas lado a lado.
- **Campos de texto** (títulos, descrições, cargos, histórias) devem ser preenchidos em Português na coluna `PT-BR` e em Inglês na coluna `EN`.
- **Campos compartilhados** (fotos, arquivos PDF, datas de publicação, ordem de exibição e a marcação de ex-aluno) são **sincronizados automaticamente**: basta alterar em um idioma que o painel copia para o outro!

---

## 3. Atualizando as Páginas Fixas (`Páginas Institucionais`)

No menu lateral esquerdo, clique em **Páginas Institucionais**. Você verá as 9 páginas do site:

### 3.1. Página Inicial (`Home`) e Sobre o Instituto (`About`)

- Na **Página Inicial**, você pode editar o banner principal (_Hero_), o texto da missão, os **4 pilares do projeto** (aulas de vôlei 2x por semana, alimentação em todas as aulas, biblioteca comunitária e passeios culturais/teatro) e os números de impacto.
- Em **Sobre o Instituto**, você pode editar a história de 4 anos do Levante, as etapas da rotina de terça e quinta-feira na Praia de Ipanema e os valores da organização.

### 3.2. Nossa Equipe & Ex-Alunos (`Team`)

Esta página apresenta quem faz o Instituto Levante acontecer no dia a dia:

1. Abra **Páginas Institucionais → Nossa Equipe & Ex-Alunos**.
2. Na seção **Destaque de Ex-Aluno(a)**, você pode editar o quadro especial no topo da página que conta como jovens formados nas aulas de praia hoje integram a equipe do instituto.
3. Na lista **Membros da Equipe**, você pode editar integrantes existentes ou clicar em **"Adicionar"** para incluir uma nova pessoa:
   - **Nome Completo** e **Cargo / Função** (preencha em Português e em Inglês).
   - **Grupo:** escolha em qual seção a pessoa aparecerá:
     - `Fundador(a) / Diretoria` (`founder`)
     - `Professor(a) / Treinador(a)` (`teacher`)
     - `Tutor(a) / Pedagógico` (`tutor`)
     - `Apoio / Staff` (`staff`)
   - **Foto (opcional):** envie uma foto quadrada ou vertical. **Não tem foto de alguém ainda?** Não tem problema! Basta deixar o campo **Foto** em branco e o site mostrará automaticamente um círculo colorido com as iniciais da pessoa.
   - **É Ex-aluno(a) do Projeto? (`isAlumni`):** ative esta chave para qualquer integrante que já foi aluno(a) do Instituto Levante. Um selo especial amarelo (**"★ Ex-aluno(a)"** em português e **"★ Alumni"** em inglês) aparecerá no cartão dessa pessoa!
   - **Nota de Ex-Aluno(a):** opcionalmente, escreva uma nota curta (ex.: `Ex-aluno • Turma 2021` em PT / `Alumni • Class of 2021` em EN).
   - **Ordem de Exibição:** números menores aparecem primeiro dentro de cada grupo (`1`, `2`, `3`...).

### 3.3. Parceiros & Patrocínio (`Partners`)

- Em **Hero → Mídia Kit (PDF)**, você pode substituir o arquivo PDF do Mídia Kit para download.
- Em **Destaque de Incentivo Fiscal**, o texto em Português explica passo a passo o patrocínio via **Lei de Incentivo ao Esporte (IRPJ — Lucro Real)**, enquanto a versão em Inglês é voltada para **Fundações Internacionais, Grants e ESG**.
- Em **Cotas de Patrocínio**, você pode editar os benefícios de cada cota (_Mantenedor, Cota Ouro, Cota Prata, Apoiador_). Se deixar o campo **Valor / Investimento** em branco, o site exibirá automaticamente _"Investimento sob consulta"_ (_"Contact us for details"_ em inglês).

---

## 4. Gerenciando Logos de Patrocinadores e Parceiros (`Parceiros e Apoiadores`)

Para adicionar uma nova empresa patrocinadora, teatro parceiro ou apoiador:

1. No menu lateral, clique em **Parceiros e Apoiadores** e depois em **Novo (New)**.
2. Preencha:
   - **Nome da Organização** (ex.: _Theatro Municipal_, _Empresa X_).
   - **Logo:** envie o arquivo do logotipo (preferencialmente em formato `.svg` ou `.png` com fundo transparente).
   - **Website Oficial:** endereço completo com `https://...` (opcional).
   - **Categoria:**
     - `Patrocinador` (empresas patrocinadoras — escolha também a **Cota de Patrocínio**: Mantenedor, Ouro, Prata ou Apoiador).
     - `Parceiro Institucional / Cultural` (teatros, centros culturais, escolas, projetos de leitura).
     - `Apoiador` (comércios locais e parceiros de alimentação/logística).
   - **Ativo no Site?:** se quiser ocultar temporariamente um parceiro sem apagá-lo, basta desativar esta chave.
3. Clique em **Salvar**.

---

## 5. Configurando PIX e Campanhas de Financiamento Coletivo (`Configurações Gerais & PIX`)

No menu lateral, clique em **Configurações Gerais & PIX → Dados de Contato e PIX**. Aqui ficam os dados que aparecem no rodapé, na página de contato e na página **Doe (`/doe/`)**:

### 5.1. Como funciona o QR Code PIX

- Sempre que você atualiza a **Chave PIX**, o **Nome do Titular PIX** (máximo de 25 letras, sem acentos) ou a **Cidade** (máximo de 15 letras, sem acentos), o site **gera automaticamente um novo QR Code oficial do Banco Central** e um novo código **PIX Copia e Cola**.
- Se preferir usar uma imagem de QR Code exportada diretamente do aplicativo do banco, basta enviá-la no campo **Imagem QR Code PIX (opcional)**. Caso contrário, deixe esse campo vazio para usar o QR Code automático.

### 5.2. Ativando ou ocultando campanhas da Vakinha / Benfeitoria

Sabemos que o Instituto Levante realiza campanhas pontuais (como a **Vakinha** do torneio de aniversário de 4 anos ou futuras campanhas na **Benfeitoria**):

- **Quando houver uma campanha ativa:** cole o endereço completo (`https://...`) no campo **Link de Crowdfunding** e escreva o nome da plataforma (ex.: `Vakinha` ou `Benfeitoria`) no campo **Nome da Plataforma**. O cartão de campanha aparecerá automaticamente na página **Doe**!
- **Quando a campanha terminar (ou não houver campanha no momento):** basta **apagar o conteúdo** do campo **Link de Crowdfunding** (deixando-o em branco) e salvar. O site esconderá o cartão de financiamento coletivo automaticamente, mantendo apenas o PIX e a doação internacional.

---

## 6. Publicando Notícias no Blog (`Blog e Notícias`)

Os convites de teatros para os alunos, torneios na praia, rodas de leitura e novidades do projeto rendem ótimas postagens para o blog!

1. No menu lateral, clique em **Blog e Notícias** e depois em **Novo (New)**.
2. Preencha na aba **PT-BR**:
   - **Título do Artigo** (ex.: _Tarde mágica no teatro com os alunos do Levante_).
   - **Resumo / Descrição SEO** (1 ou 2 frases que aparecem no cartão da notícia e quando o link é compartilhado no WhatsApp).
   - **Data de Publicação** e **Imagem de Capa**.
   - **Conteúdo do Artigo:** escreva o texto livremente; você pode usar subtítulos, negrito, listas e inserir fotos pelo botão de imagem da barra de ferramentas.
3. Alterne para a aba **EN** (Inglês) e preencha o título, resumo e texto traduzidos.
4. Se o texto ainda não estiver pronto para ir ao ar, marque a opção **Rascunho? (não publicar)**. Quando estiver pronto, deixe **Rascunho** desmarcado e clique em **Salvar**.

---

## 7. Publicando Relatórios e Certidões (`Transparência`)

1. Vá em **Páginas Institucionais → Transparência & Governança**.
2. Em **Relatórios & Prestações de Contas**, clique em **Adicionar**.
3. Informe o **Ano de Referência** (ex.: `2025`), o **Título do Documento** (em PT e EN), a **Categoria** (ex.: _Relatório Anual_, _Estatuto_, _Certidão_) e envie o **Arquivo PDF**.
4. Clique em **Salvar**.

---

## 8. Dicas Rápidas de Boas Práticas

- **Fotos leves:** antes de subir fotos de celular muito pesadas (acima de 3 MB), dê preferência a imagens entre **1200 px e 1600 px** de largura em formato `.jpg` ou `.webp` para manter o carregamento instantâneo no 4G.
- **Links internos:** ao criar botões que apontam para páginas do próprio site, comece sempre com barra `/` (por exemplo: `/doe/` em português e `/en/donate/` em inglês).
- **Dúvidas ou recuperação de versão:** como todo o conteúdo fica salvo no histórico do GitHub, nenhuma alteração é perdida — qualquer versão anterior de texto ou foto pode ser recuperada a qualquer momento.
