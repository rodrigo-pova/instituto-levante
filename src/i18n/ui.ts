export const ui = {
  'pt-br': {
    // Navigation
    'nav.about': 'Sobre',
    'nav.team': 'Equipe',
    'nav.partners': 'Parcerias & Patrocínio',
    'nav.transparency': 'Transparência',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.getInvolved': 'Participe',
    'nav.donate': 'Doe',
    'nav.menu': 'Menu',
    'nav.close': 'Fechar menu',
    'nav.skipToContent': 'Pular para o conteúdo',

    // Language switcher
    'lang.switch': 'Mudar idioma',

    // Common CTAs & Actions
    'action.readMore': 'Ler mais',
    'action.backToBlog': 'Voltar para o blog',
    'action.downloadPdf': 'Baixar PDF',
    'action.copyPixKey': 'Copiar chave PIX',
    'action.copyPixCode': 'Copiar código Copia e Cola',
    'action.copied': 'Copiado!',
    'action.contactUs': 'Fale conosco',
    'action.sendMessage': 'Enviar mensagem',
    'action.sending': 'Enviando...',
    'action.viewAll': 'Ver todos',

    // Team
    'team.alumniBadge': 'Ex-aluno(a) do Levante',
    'team.group.founder': 'Fundadores',
    'team.group.teacher': 'Professores',
    'team.group.tutor': 'Monitores e Tutores',
    'team.group.staff': 'Equipe',

    // Blog
    'blog.publishedOn': 'Publicado em',
    'blog.updatedOn': 'Atualizado em',
    'blog.by': 'por',
    'blog.readTime': 'min de leitura',
    'blog.availableInOtherLang':
      'Este artigo também está disponível em Inglês.',
    'blog.empty': 'Nenhuma publicação encontrada no momento.',

    // Forms
    'form.name': 'Nome completo',
    'form.email': 'E-mail',
    'form.phone': 'Telefone / WhatsApp',
    'form.company': 'Empresa / Organização',
    'form.role': 'Cargo',
    'form.subject': 'Assunto',
    'form.message': 'Mensagem',
    'form.interest': 'Área de interesse',
    'form.tierInterest': 'Cota de interesse',
    'form.required': 'Obrigatório',
    'form.honeypot': 'Não preencha este campo se você for humano',

    // Footer
    'footer.rights': 'Todos os direitos reservados.',
    'footer.cnpj': 'CNPJ',
    'footer.social': 'Redes Sociais',
    'footer.quickLinks': 'Acesso Rápido',
    'footer.location': 'Aulas na praia',

    // 404
    '404.title': 'Página não encontrada',
    '404.description': 'A página que você procura não existe ou foi movida.',
    '404.backHome': 'Voltar para o início',
  },
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.team': 'Team',
    'nav.partners': 'Partners & Sponsorship',
    'nav.transparency': 'Transparency',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.getInvolved': 'Get Involved',
    'nav.donate': 'Donate',
    'nav.menu': 'Menu',
    'nav.close': 'Close menu',
    'nav.skipToContent': 'Skip to content',

    // Language switcher
    'lang.switch': 'Switch language',

    // Common CTAs & Actions
    'action.readMore': 'Read more',
    'action.backToBlog': 'Back to blog',
    'action.downloadPdf': 'Download PDF',
    'action.copyPixKey': 'Copy PIX key',
    'action.copyPixCode': 'Copy PIX code',
    'action.copied': 'Copied!',
    'action.contactUs': 'Contact us',
    'action.sendMessage': 'Send message',
    'action.sending': 'Sending...',
    'action.viewAll': 'View all',

    // Team
    'team.alumniBadge': 'Levante Alumni',
    'team.group.founder': 'Founders',
    'team.group.teacher': 'Teachers',
    'team.group.tutor': 'Tutors',
    'team.group.staff': 'Staff',

    // Blog
    'blog.publishedOn': 'Published on',
    'blog.updatedOn': 'Updated on',
    'blog.by': 'by',
    'blog.readTime': 'min read',
    'blog.availableInOtherLang': 'This post is also available in Portuguese.',
    'blog.empty': 'No posts found at the moment.',

    // Forms
    'form.name': 'Full name',
    'form.email': 'Email',
    'form.phone': 'Phone / WhatsApp',
    'form.company': 'Company / Organization',
    'form.role': 'Job title',
    'form.subject': 'Subject',
    'form.message': 'Message',
    'form.interest': 'Area of interest',
    'form.tierInterest': 'Sponsorship tier of interest',
    'form.required': 'Required',
    'form.honeypot': 'Do not fill this field if you are human',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.cnpj': 'CNPJ (Tax ID)',
    'footer.social': 'Social Media',
    'footer.quickLinks': 'Quick Links',
    'footer.location': 'Beach classes location',

    // 404
    '404.title': 'Page not found',
    '404.description':
      'The page you are looking for does not exist or has been moved.',
    '404.backHome': 'Back to homepage',
  },
} as const satisfies Record<string, Record<string, string>>;

export type UIKey = keyof (typeof ui)['pt-br'];
