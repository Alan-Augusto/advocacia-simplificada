export const HERO_CONTENT = {
  badge: "Especialista em Rescisão Indireta",
  title_prefix: "Seus direitos",
  title_highlight: "trabalhistas",
  title_suffix: "simplificados.",
  description: "Cada cliente é único e seu caso é nosso compromisso. Defesa especializada com atendimento prático e individualizado.",
  cta_primary: "Falar com o Advogado",
  cta_secondary: "Conhecer Serviços",
  rating_text: "5/5 em avaliações"
};

export const TRUST_BAR = [
  { icon: "solar:shield-check-linear", text: "OAB Regular" },
  { icon: "solar:lock-linear", text: "Sigilo Total" },
  { icon: "solar:chat-round-check-linear", text: "Consulta Gratuita" },
  { icon: "solar:star-bold", text: "5/5 Avaliações", color: "#f59e0b" },
  { icon: "solar:smartphone-linear", text: "Atendimento Online" },
];

export const PROBLEM_STATS = {
  title_badge: "Por que lutar pelos seus direitos?",
  title: "Milhares de trabalhadores perdem direitos todos os dias",
  description: "Falta de registro, pagamentos por fora, horas extras não pagas, demissões abusivas. Se alguma dessas situações parece familiar, você pode ter direitos a receber.",
  stats: [
    { value: "72%", label: "dos trabalhadores já sofreram alguma irregularidade" },
    { value: "5 anos", label: "é o prazo máximo para buscar seus direitos" },
    { value: "40%", label: "multa sobre o FGTS em demissão sem justa causa" },
    { value: "100%", label: "comprometimento com cada caso atendido" },
  ]
};

export const SERVICES = [
  {
    id: "01",
    title: "Vínculo de Emprego",
    description: "Reconhecimento de vínculo para trabalhadores sem carteira assinada, freelancers fixos e autônomos fraudados.",
    tags: ["Carteira assinada", "Freelancer fixo", "Regularização"],
    icon: "solar:document-add-linear",
    colorClass: "indigo"
  },
  {
    id: "02",
    title: "Remuneração e Comissões",
    description: "Regularização de pagamentos por fora, equiparação salarial e combate a descontos indevidos no salário.",
    tags: ["Salário por fora", "Equiparação", "Descontos"],
    icon: "solar:wallet-money-linear",
    colorClass: "emerald"
  },
  {
    id: "03",
    title: "Rescisão Indireta",
    description: "Quando o empregador comete faltas graves — FGTS não recolhido, salários atrasados, assédio — você pode \"demitir o patrão\" e receber todas as verbas como demissão sem justa causa.",
    tags: ["FGTS + 40%", "Seguro-desemprego", "Verbas integrais"],
    icon: "solar:logout-2-linear",
    colorClass: "indigo",
    highlight: true
  },
  {
    id: "04",
    title: "Jornada e Horas Extras",
    description: "Cobrança de horas extras, intervalos intrajornada e interjornada não concedidos e adicional noturno.",
    tags: ["Horas extras", "Intervalos", "Adicional noturno"],
    icon: "solar:clock-circle-linear",
    colorClass: "blue"
  },
  {
    id: "05",
    title: "Funções e Atribuições",
    description: "Desvio e acúmulo de função quando o trabalhador exerce tarefas diferentes ou acumuladas sem a devida compensação.",
    tags: ["Desvio de função", "Acúmulo"],
    icon: "solar:user-check-linear",
    colorClass: "violet"
  },
  {
    id: "06",
    title: "Saúde e Segurança",
    description: "Adicionais de insalubridade e periculosidade, acidentes de trabalho e doenças ocupacionais como LER e Burnout.",
    tags: ["Insalubridade", "Periculosidade", "Acidente"],
    icon: "solar:heart-pulse-linear",
    colorClass: "rose"
  },
  {
    id: "07",
    title: "Danos e Indenizações",
    description: "Dano moral, material, estético e existencial. Combate ao assédio, humilhações e discriminação no ambiente de trabalho.",
    tags: ["Assédio moral", "Discriminação", "Dano estético"],
    icon: "solar:shield-warning-linear",
    colorClass: "orange"
  },
  {
    id: "08",
    title: "Convenções Coletivas",
    description: "Análise aprofundada das convenções sindicais da sua categoria para aplicar a norma mais favorável ao trabalhador.",
    tags: ["Sindicatos", "Pisos salariais", "Adicionais"],
    icon: "solar:users-group-rounded-linear",
    colorClass: "teal"
  },
  {
    id: "09",
    title: "Domésticos e Cuidadores",
    description: "Atuação especializada nos direitos de empregadas domésticas e cuidadoras de idosos conforme a PEC das Domésticas.",
    tags: ["Domésticas", "Cuidadores", "PEC"],
    icon: "solar:home-smile-linear",
    colorClass: "pink"
  }
];

export const SPECIAL_SERVICE = {
  badge: "Área de Maior Atuação",
  title: "Rescisão Indireta",
  description: "Caso a empresa não trate seus empregados de maneira correta, ignorando suas necessidades e não pagando corretamente seus direitos, os trabalhadores podem pedir à Justiça do Trabalho para terminar seu contrato — recebendo tudo como uma demissão sem justa causa.",
  tags: ["FGTS + Multa 40%", "Seguro-desemprego", "Aviso prévio", "Férias e 13º"],
  cta: "Verificar meu caso",
  alerts: [
    { title: "FGTS não recolhido", sub: "Falta grave do empregador" },
    { title: "Atraso de salários", sub: "Descumprimento do contrato" },
    { title: "Assédio moral", sub: "Ambiente de trabalho hostil" },
    { title: "Descumprimento de obrigações", sub: "Não pagamento de direitos" },
  ]
};

export const DIFFERENTIALS = [
  {
    title: "Abordagem Educativa",
    description: "Explicação clara de cada etapa e direito envolvido. Você entende o que está acontecendo no seu caso a todo momento.",
    icon: "solar:book-minimalistic-linear"
  },
  {
    title: "Estratégia Personalizada",
    description: "Análise caso a caso para identificar nulidades contratuais e oportunidades específicas que maximizem seus direitos.",
    icon: "solar:target-linear"
  },
  {
    title: "Atendimento Humanizado",
    description: "Disponibilidade, solicitude e empatia. Cada cliente é tratado com respeito e atenção que merece.",
    icon: "solar:hand-heart-linear"
  },
  {
    title: "Provas Digitais",
    description: "Orientação sobre como utilizar mensagens de WhatsApp, e-mails e prints como prova de subordinação e irregularidades.",
    icon: "solar:smartphone-linear"
  }
];

export const DIFFERENTIALS_CONTENT = {
  badge: "Diferenciais",
  title: "Por que escolher o Dr. Luciano?",
  description:
    "Mais do que representar, o objetivo é empoderar cada cliente com conhecimento sobre seus direitos e conduzir cada caso com total dedicação.",
  process_badge: "Como funciona",
  process_title: "Do contato à resolução"
};

export const STEPS = [
  { number: "1", title: "Contato Inicial", description: "Você escolhe qual assunto deseja atendimento e explica brevemente sua situação." },
  { number: "2", title: "Análise do Caso", description: "Dr. Luciano vai analisar seu caso e identificar os pontos mais relevantes." },
  { number: "3", title: "Estratégia Jurídica", description: "Definição da melhor estratégia com transparência total sobre prazos, riscos e expectativas." },
  { number: "4", title: "Resolução", description: "Acompanhamento constante até a resolução definitiva, seja por acordo ou decisão judicial." }
];

export const TESTIMONIALS = [
  {
    name: "Delania Rodrigues",
    date: "Ontem",
    text: "Muito obrigado ☺️",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjU2LRzQH4bzS5mvIcL7bHNN6wykyulSWCbCbD4f6_aSN9_2XsjpMQ=s35-c-rp-mo-br100"
  },
  {
    name: "Luciene Leite",
    date: "Há 5 dias",
    text: "Excelente advogado",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUtmw4AzUNWA5sebagKZZh1M56wHMUdcdWdIFLrIidbqBLSPBA3=s35-c-rp-mo-br100"
  },
  {
    name: "Lívia Fortes",
    date: "Há 2 semanas",
    text: "Achei o advogado Luciano Graciano muito profissional, atencioso e que cumpre com o que promete. Recomendo os seus serviços!",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjXCcTG3ORrI0qN8LBQQvfSyejamKQADJF8cieUVODwWnC1ttkbTJA=s35-c-rp-mo-br100"
  },
  {
    name: "Aldemir Gomes de sa",
    date: "30 de abr. de 2024",
    text: "Um excelente profissional",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUImGb0edt6GgZcq_enVyNotXlCx1sZDOd7lVA7rR3cQzTiKw=s35-c-rp-mo-ba2-br100"
  },
  {
    name: "Lucineia Rodrigues",
    date: "3 de abr. de 2024",
    text: "Em 2017 me indicaram o Dr Luciano excelente profissional esclareceu todas as minhas dúvidas em relação ao que eu estava passando.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocICbD0bqPHTfRUVhHU6XT13vKwG2bnd9hJH5LrvQu4OuHx3jA=s35-c-rp-mo-br100"
  },
  {
    name: "Ana Kesia Valadares",
    date: "14 de mar. de 2024",
    text: "Venho agradecer ao Dr. Luciano pelo atendimento prestado, sanou todas as minhas dúvidas. Super recomendo.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWWxvAwzN7LqqUvNQu8_3wFxMS9_zOPbc33qJkJgXQ44mpQhesNSA=s35-c-rp-mo-br100"
  },
  {
    name: "Marco Fernando De Oliveira Costa",
    date: "11 de mar. de 2024",
    text: "Ótimo atendimento",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocImFZZj4QMJMlpU0ol279aYmTzSciTI_v09kEAMnjq7N2V6nA=s35-c-rp-mo-br100"
  },
  {
    name: "Nayara Da Silva Lana",
    date: "6 de mar. de 2024",
    text: "Muito eficiente! Esclareceu todas as minhas dúvidas.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocLquD7QyhHXCCdhioMEG4Ry2G0_QwCW2dZ-rpB0Jm7MDrykbw=s35-c-rp-mo-br100"
  },
  {
    name: "Fabiana Garcia",
    date: "23 de fev. de 2024",
    text: "Foi excelente advogado, graças a Deus deu tudo certo.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocLNAK29tFoED-UkLwznNuXb-MBHNHXRcHuBf8-jPbJojHe7nQ=s35-c-rp-mo-br100"
  },
  {
    name: "Aparecida Felix",
    date: "20 de fev. de 2024",
    text: "Profissional muito atencioso no atendimento a seus clientes. Eu recomendo!",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKbuYQtmn8_hGV-MyU_7Zsb7EGQMwHKokgT1Vdzldx0KMyO5A=s35-c-rp-mo-br100"
  },
  {
    name: "Polliana Catarina",
    date: "16 de fev. de 2024",
    text: "Super indico, um ótimo profissional. Me ajudou muito no meu processo.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjVboSF3QprAAriNaAWD_Wa2rBuDuNjOWiouKKzf4MwSn8E8DmwoJA=s35-c-rp-mo-br100"
  },
  {
    name: "Antonio Carlos Costa",
    date: "15 de fev. de 2024",
    text: "Pronto atendimento e consulta satisfatória. Ótimo atendimento.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKyo-Q0UhXmKcHU4GLxiesNR0EVf6XNTuCtLymy-ohmgE83jw=s35-c-rp-mo-br100"
  },
  {
    name: "Anny Leroy",
    date: "30 de jan. de 2024",
    text: "Atendimento top",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocLj_L1ygmkLuFCYJ0bYTMSHOkkTiTxHKK4g_7rpuduhhwrm=s35-c-rp-mo-br100"
  },
  {
    name: "Junior Pombo",
    date: "27 de jan. de 2024",
    text: "Gratidão pelo carinho e pela competência em todos os serviços prestados.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUfa-8wPoWwU_bFo6KhLkvjisOHpUdF_mcu9IbrraBwmTg26oaj=s35-c-rp-mo-br100"
  },
  {
    name: "Marcos Lott",
    date: "23 de jan. de 2024",
    text: "Fiquei muito satisfeito. Recomendo muito o serviço.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWYXCDIsXODtu5ZiRdsAiYozCuXN0BWXhGeqID57Vb35rXa52Lh=s35-c-rp-mo-br100"
  },
  {
    name: "Cibelle Nunes",
    date: "22 de jan. de 2024",
    text: "Luciano é um profissional extremamente solícito. Sempre disponível para esclarecer minhas dúvidas. Recomendo de olhos fechados.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjULPlaoFo-u7AIYs_rLwyh-Mosd1hlV4DWt67mzCbbtS7DpMRoSGw=s35-c-rp-mo-br100"
  },
  {
    name: "Marina Calixto",
    date: "22 de jan. de 2024",
    text: "Excelente profissional!",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocLS6D99mXkAOo89jqUEGu_0EtGTV9EP-ynY_GcZENkTStQ8dg=s35-c-rp-mo-br100"
  },
  {
    name: "Júlia F. Lins do Rego",
    date: "23 de out. de 2021",
    text: "Admirável!",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKjGVZ3_XLgS2661l5QE9v50W1cEFIKpETy-033D0vnayZI8yQ=s35-c-rp-mo-br100"
  },
  {
    name: "Yasmim S",
    date: "23 de out. de 2021",
    text: "Muito bom! Me ajudou muito.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWJvMWYoduukwbOugEQdU9Q7bvIUpEaLhVkktCRDyt7g8vENe_Ghg=s35-c-rp-mo-br100"
  },
  {
    name: "Ana Luiza Morais",
    date: "23 de out. de 2021",
    text: "Um ótimo profissional, resolveu minha demanda com excelência! Super recomendo!",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjV_jXXInCekwqx0vYS47b-u7WIrPg86QXkMxpnkXBYc1rYDL4K5=s35-c-rp-mo-br100"
  }
];

export const FAQS = [
  {
    question: "Trabalho sem carteira assinada. Tenho algum direito?",
    answer: "Sim! Se você trabalha com pessoalidade, habitualidade, subordinação e recebe remuneração, existe vínculo empregatício independente de registro. Podemos entrar na Justiça para reconhecer esse vínculo e garantir todos os seus direitos: FGTS, férias, 13º, INSS e verbas rescisórias."
  },
  {
    question: "Recebo parte do salário \"por fora\". Isso é irregular?",
    answer: "Sim, é totalmente irregular. Todo valor pago em razão do trabalho deve constar no contracheque e integrar o cálculo de FGTS, férias, 13º salário e recolhimentos do INSS. Podemos comprovar esses pagamentos e buscar a diferença de todos os direitos afetados."
  },
  {
    question: "Fui demitido por justa causa injusta. O que posso fazer?",
    answer: "Se a justa causa foi aplicada sem motivo real, de forma desproporcional ou sem observar os requisitos legais, podemos pedir sua reversão na Justiça. Com a reversão, você passa a ter direito ao aviso prévio, multa de 40% do FGTS, seguro-desemprego e todas as verbas rescisórias integrais."
  },
  {
    question: "Qual o prazo para entrar com uma ação trabalhista?",
    answer: "Você tem até 2 anos após o desligamento da empresa para ingressar com a ação, podendo cobrar direitos dos últimos 5 anos de trabalho. Por isso, é fundamental não deixar para a última hora. Quanto antes procurar orientação, melhor."
  },
  {
    question: "O que é rescisão indireta?",
    answer: "É quando o empregador comete faltas graves — como não recolher FGTS, atrasar salários, praticar assédio ou descumprir obrigações do contrato. Nesse caso, o empregado pode \"demitir o patrão\" e receber todas as verbas como se tivesse sido demitido sem justa causa, incluindo multa de 40%, seguro-desemprego e aviso prévio."
  },
  {
    question: "Sofro assédio moral no trabalho. Tenho direito a indenização?",
    answer: "Sim! Humilhações, perseguições, tratamento rigoroso excessivo, isolamento e outras condutas abusivas configuram assédio moral e geram direito a indenização por dano moral. Além disso, essa situação pode embasar um pedido de rescisão indireta."
  },
  {
    question: "A consulta inicial é realmente gratuita?",
    answer: "Sim, a primeira consulta é totalmente gratuita e sem compromisso. Nela, analisamos sua situação, identificamos possíveis direitos e explicamos como seria a atuação no seu caso, com total transparência sobre prazos, custos e expectativas."
  }
];

export const BLOG_POSTS = [
  {
    slug: "/bares-e-restaurantes",
    title: "Funcionários de Bares e Restaurantes",
    description: "Entenda as particularidades do setor e como garantir seus direitos.",
    icon: "solar:cup-hot-linear",
    color: "amber",
    tags: ["Gorjetas", "Freelancer", "Insalubridade"]
  },
  {
    slug: "/convencao-garcons",
    title: "Direitos Convencionais em Bares e Restaurantes",
    description: "Funcionários desse segmento possuem alguns direitos convencionais, descubra quais são eles.",
    icon: "solar:clipboard-list-linear",
    color: "teal",
    tags: ["Piso salarial", "Hora extra", "Adicional noturno"]
  },
  {
    slug: "/recisao-contrato-trabalho",
    title: "Rescisão de Contrato de Trabalho",
    description: "O que você deve receber na demissão e quando ocorre a rescisão indireta.",
    icon: "solar:document-text-linear",
    color: "indigo",
    tags: ["Rescisão indireta", "Justa causa", "Anulação"],
    highlight: true
  },
  {
    slug: "/salario-por-fora",
    title: "Salário por Fora",
    description: "Gorjetas, comissões e recebimentos extra-folha. Saiba como receber seus direitos.",
    icon: "solar:wallet-money-linear",
    color: "emerald",
    tags: ["Comissões", "Gorjetas", "Extra-folha"]
  },
  {
    slug: "/horas-remuneracao",
    title: "Horas e Remuneração",
    description: "Saiba como ter uma remuneração justa com base nas horas de trabalho.",
    icon: "solar:clock-circle-linear",
    color: "blue",
    tags: ["Horas extras", "Intervalo", "Adicional noturno"]
  },
  {
    slug: "/danos-discriminacao",
    title: "Danos e Discriminação",
    description: "Entenda as situações que podem gerar indenização.",
    icon: "solar:shield-warning-linear",
    color: "rose",
    tags: ["Dano moral", "Assédio", "Discriminação"]
  },
  {
    slug: "/funcoes",
    title: "Funções",
    description: "Como a legislação garante a igualdade e justiça salarial com base no serviço prestado.",
    icon: "solar:user-check-linear",
    color: "violet",
    tags: ["Desvio", "Acúmulo", "Equiparação"]
  },
  {
    slug: "/condicoes-trabalho",
    title: "Condições de Trabalho",
    description: "Conheça as situações que podem aumentar a remuneração com base no serviço prestado.",
    icon: "solar:heart-pulse-linear",
    color: "orange",
    tags: ["Insalubridade", "Periculosidade", "Acidente"]
  },
  {
    slug: "/servicos-especiais",
    title: "Serviços Especiais",
    description: "Entenda o que a lei das domésticas e cuidadoras de idosos te assegura.",
    icon: "solar:home-smile-linear",
    color: "pink",
    tags: ["Domésticas", "Cuidadores", "PEC"]
  },
  {
    slug: "/vinculo-emprego",
    title: "Vínculo de Emprego",
    description: "Como comprovar para receber seus direitos.",
    icon: "solar:document-add-linear",
    color: "cyan",
    tags: ["Pessoalidade", "Subordinação", "Comprovação"]
  }
];

export const HEADER_CONTENT = {
  brand: "Dr. Luciano",
  cta: "Consulta Gratuita",
  mobile_menu_label: "Abrir menu"
};

export const HEADER_NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#faq", label: "Dúvidas" },
  { href: "#blog", label: "Blog" }
];

export const SERVICES_CONTENT = {
  badge: "Áreas de Atuação",
  title_prefix: "Defesa completa dos",
  title_suffix: "seus direitos trabalhistas",
  description:
    "Atuação abrangente em todas as frentes do Direito do Trabalho, com foco na defesa do empregado."
};

export const TESTIMONIALS_CONTENT = {
  badge: "Depoimentos",
  title: "O que nossos clientes dizem",
  rating_text: "Nota 5/5 com base em avaliações reais"
};

export const FAQ_CONTENT = {
  badge: "Perguntas Frequentes",
  title: "Tire suas dúvidas",
  description:
    "Respostas para as perguntas mais comuns sobre direitos trabalhistas."
};

export const BLOG_PREVIEW_CONTENT = {
  badge: "Blog Informativo",
  title_prefix: "Conheça seus direitos",
  title_suffix: "em detalhes",
  description:
    "Artigos completos para você entender cada aspecto dos seus direitos trabalhistas. Conhecimento é o primeiro passo para a defesa.",
  highlight_badge: "Destaque"
};

export const CTA_CONTENT = {
  badge: "Atendimento disponível agora",
  title_prefix: "Não deixe seus direitos",
  title_suffix: "passarem em branco.",
  description:
    "O prazo para buscar seus direitos é limitado. Entre em contato agora para uma consulta gratuita e descubra o que você pode receber.",
  cta_primary: "Iniciar Atendimento",
  footnote:
    "Consulta inicial gratuita · Sigilo garantido · Atendimento online"
};

export const FOOTER_CONTENT = {
  brand: "Dr. Luciano",
  description:
    "Advocacia Trabalhista Especializada. Defesa dos direitos do trabalhador com atendimento humanizado e resultados comprovados.",
  navigation_title: "Navegação",
  contact_title: "Contato",
  copyright:
    "© 2025 Dr. Luciano — Advocacia Trabalhista. Todos os direitos reservados.",
  oab: "OAB/XX 000.000"
};

export const FOOTER_NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#faq", label: "Dúvidas Frequentes" },
  { href: "#blog", label: "Blog" }
];

export const FLOATING_WHATSAPP_CONTENT = {
  aria_label: "Falar pelo WhatsApp"
};
