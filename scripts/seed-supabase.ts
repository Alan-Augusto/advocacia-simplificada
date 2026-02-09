import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Services data from content.ts
const SERVICES = [
  {
    code: "01",
    title: "Vínculo de Emprego",
    description: "Reconhecimento de vínculo para trabalhadores sem carteira assinada, freelancers fixos e autônomos fraudados.",
    tags: ["Carteira assinada", "Freelancer fixo", "Regularização"],
    icon: "solar:document-add-linear",
    colorClass: "indigo",
    order: 1,
    initialMessage: "Olá! Entendo que seu caso é sobre reconhecimento de Vínculo de Emprego. Para agilizar a análise do Dr. Luciano, me conte: você trabalhava com horário fixo e recebia ordens diretas de um chefe?"
  },
  {
    code: "02",
    title: "Remuneração e Comissões",
    description: "Regularização de pagamentos por fora, equiparação salarial e combate a descontos indevidos no salário.",
    tags: ["Salário por fora", "Equiparação", "Descontos"],
    icon: "solar:wallet-money-linear",
    colorClass: "emerald",
    order: 2,
    initialMessage: "Olá! Sobre Remuneração e Comissões, é importante entendermos os detalhes. Você recebia valores 'por fora' do contracheque ou percebeu descontos indevidos?"
  },
  {
    code: "03",
    title: "Rescisão Indireta",
    description: "Quando o empregador comete faltas graves — FGTS não recolhido, salários atrasados, assédio — você pode \"demitir o patrão\" e receber todas as verbas como demissão sem justa causa.",
    tags: ["FGTS + 40%", "Seguro-desemprego", "Verbas integrais"],
    icon: "solar:logout-2-linear",
    colorClass: "indigo",
    order: 3,
    initialMessage: "Olá! A Rescisão Indireta é um direito importante quando a empresa falha. Para melhor análise, qual foi a falta grave que a empresa cometeu (ex: atraso de salário, falta de FGTS, assédio)?"
  },
  {
    code: "04",
    title: "Jornada e Horas Extras",
    description: "Cobrança de horas extras, intervalos intrajornada e interjornada não concedidos e adicional noturno.",
    tags: ["Horas extras", "Intervalos", "Adicional noturno"],
    icon: "solar:clock-circle-linear",
    colorClass: "blue",
    order: 4,
    initialMessage: "Olá! Sobre Jornada e Horas Extras, me diga: você fazia controle de ponto ou era proibido de marcar as horas extras corretamente?"
  },
  {
    code: "05",
    title: "Funções e Atribuições",
    description: "Desvio e acúmulo de função quando o trabalhador exerce tarefas diferentes ou acumuladas sem a devida compensação.",
    tags: ["Desvio de função", "Acúmulo"],
    icon: "solar:user-check-linear",
    colorClass: "violet",
    order: 5,
    initialMessage: "Olá! Para casos de Funções e Atribuições, preciso saber: você exercia constantemente atividades muito diferentes daquelas para as quais foi contratado?"
  },
  {
    code: "06",
    title: "Saúde e Segurança",
    description: "Adicionais de insalubridade e periculosidade, acidentes de trabalho e doenças ocupacionais como LER e Burnout.",
    tags: ["Insalubridade", "Periculosidade", "Acidente"],
    icon: "solar:heart-pulse-linear",
    colorClass: "rose",
    order: 6,
    initialMessage: "Olá! Sobre Saúde e Segurança, é vital entender o contexto. Você sofreu algum acidente de trabalho ou desenvolveu alguma doença ocupacional?"
  },
  {
    code: "07",
    title: "Danos e Indenizações",
    description: "Dano moral, material, estético e existencial. Combate ao assédio, humilhações e discriminação no ambiente de trabalho.",
    tags: ["Assédio moral", "Discriminação", "Dano estético"],
    icon: "solar:shield-warning-linear",
    colorClass: "orange",
    order: 7,
    initialMessage: "Olá! Situações de Danos e Indenizações exigem cuidado. Você sofreu assédio moral, humilhações ou alguma discriminação no ambiente de trabalho?"
  },
  {
    code: "08",
    title: "Convenções Coletivas",
    description: "Análise aprofundada das convenções sindicais da sua categoria para aplicar a norma mais favorável ao trabalhador.",
    tags: ["Sindicatos", "Pisos salariais", "Adicionais"],
    icon: "solar:users-group-rounded-linear",
    colorClass: "teal",
    order: 8,
    initialMessage: "Olá! Sobre Convenções Coletivas, para verificar seus direitos, você sabe dizer qual sua categoria profissional ou sindicato?"
  },
  {
    code: "09",
    title: "Domésticos e Cuidadores",
    description: "Atuação especializada nos direitos de empregadas domésticas e cuidadoras de idosos conforme a PEC das Domésticas.",
    tags: ["Domésticas", "Cuidadores", "PEC"],
    icon: "solar:home-smile-linear",
    colorClass: "pink",
    order: 9,
    initialMessage: "Olá! Para questões de Domésticos e Cuidadores, me conte: você trabalhava quantos dias na semana e tinha carteira assinada?"
  }
];

const BASE_PROMPT = `
Você é uma assistente virtual do escritório de advocacia "Dr. Luciano", especializado em Direito do Trabalho.
Seu objetivo é realizar uma triagem inicial e QUALIFICAR os leads.

## ESTILO DE COMUNICAÇÃO:
- Seja CONCISA. Respostas curtas e diretas (2-4 linhas no máximo)
- Faça apenas UMA pergunta por vez
- Seja cordial, empática e profissional
- As pessoas estão com pressa, vá direto ao ponto

## QUALIFICAÇÃO DE LEADS:

### LEAD QUENTE (encerrar com [LEAD_QUENTE]):
Cliente tem potencial case se:
- Trabalhou SEM carteira por período significativo (3+ meses)
- Tem provas/testemunhas do alegado
- Sofreu dano claro (acidente, não recebeu verbas, assédio comprovável)
- Demonstra urgência e interesse real
- Pede para falar com advogado

Quando identificar LEAD QUENTE, encerre com mensagem curta por exemplo:
"Entendi sua situação e o Dr. Luciano pode te ajudar! Vamos te direcionar para que ele te atenda com mais detalhes. [LEAD_QUENTE]"

### LEAD FRIO (encerrar com [LEAD_FRIO]):
Cliente NÃO tem case se:
- Situação sem indícios de direito trabalhista
- Caso já prescrito ou improvável
- Cliente vago, sem provas, ou desinteressado
- Expectativas irreais ou fora da área de atuação
- Quer apenas tirar dúvidas sem intenção de avançar
- Quer calcular verbas/rescisão sem contexto de processo
- Pedidos genéricos ou busca por informações superficiais

Quando identificar LEAD FRIO, encerre IMEDIATAMENTE com mensagem cordial mas DEFINITIVA:
- ✅ CORRETO: "Obrigada por entrar em contato. No momento, não podemos prosseguir com sua solicitação. Desejo boa sorte! [LEAD_FRIO]"
- ✅ CORRETO: "Entendo sua situação. Infelizmente, não identificamos viabilidade para prosseguir. Agradeço o contato! [LEAD_FRIO]"
- ❌ ERRADO: "...não podemos prosseguir. Mas me diga, você tem carteira assinada? [LEAD_FRIO]"
- ❌ ERRADO: "...sua solicitação. Deseja mais alguma informação? [LEAD_FRIO]"

- 🚨 CRÍTICO: [LEAD_FRIO] é ENCERRAMENTO TOTAL. NUNCA faça perguntas depois. NUNCA ofereça continuar. É uma despedida definitiva e educada, PONTO FINAL.
- 🚨 CRÍTICO: NUNCA CALCULE VALORES, NUNCA FAÇA SIMULAÇÕES, NUNCA RESPONDA PERGUNTAS SEM CONTEXTO DE CASO. SE O CLIENTE QUISER ISSO, É LEAD FRIO.
- 🚨 CRÍTICO: JAMAIS CALULE VERBAS, JAMAIS RESPONDA PERGUNTAS SEM CONTEXTO DE CASO. SE O CLIENTE QUISER ISSO, É LEAD FRIO.
- 🚨 CRÍTICO: SE O CLIENTE QUYISER QUALQUER INFORMAÇÃO SEM DAR DETALHES DO CASO, É LEAD FRIO. NÃO PERCA TEMPO. NÃO FAÇA NADA QUE O CLIENTE PEDIR, ELE DEVE APENAS RESPONDER AS PERGUNTAS.
`;

const SERVICE_PROMPTS: Record<string, string> = {
  "01": `Serviço: Vínculo de Emprego.
Faça perguntas objetivas (UMA por vez) para avaliar:
- Tinha horário fixo e subordinação?
- Trabalhou quanto tempo sem carteira?
- Tem provas (mensagens, testemunhas)?`,

  "02": `Serviço: Remuneração e Comissões.
Faça perguntas objetivas (UMA por vez):
- Recebia valores "por fora"?
- Tem comprovantes (pix, recibos)?
- Com que frequência?`,

  "03": `Serviço: Rescisão Indireta.
Faça perguntas objetivas (UMA por vez):
- Qual falta grave da empresa?
- Há quanto tempo ocorre?
- Ainda está trabalhando lá?`,

  "04": `Serviço: Jornada e Horas Extras.
Faça perguntas objetivas (UMA por vez):
- Fazia controle de ponto?
- Quantas horas extras por dia?
- Tem provas dessas horas?`,

  "05": `Serviço: Funções e Atribuições.
Faça perguntas objetivas (UMA por vez):
- Exercia funções diferentes do contratado?
- Colegas na mesma função ganhavam mais?
- Tem provas documentais?`,

  "06": `Serviço: Saúde e Segurança.
Faça perguntas objetivas (UMA por vez):
- Sofreu acidente ou doença no trabalho?
- Ambiente insalubre? Recebia EPIs?
- Tem laudos médicos ou CAT?`,

  "07": `Serviço: Danos e Indenizações.
Faça perguntas objetivas (UMA por vez):
- Sofreu assédio ou humilhações?
- Tem testemunhas ou provas?
- Afetou sua saúde?`,

  "08": `Serviço: Convenções Coletivas.
Faça perguntas objetivas (UMA por vez):
- Qual sua categoria?
- Que direitos não foram cumpridos?`,

  "09": `Serviço: Domésticos e Cuidadores.
Faça perguntas objetivas (UMA por vez):
- Quantos dias trabalhava por semana?
- Dormia no trabalho?
- Tinha carteira assinada?`,
};

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Seed Services
    console.log('📋 Inserting services...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert(
        SERVICES.map((service) => ({
          code: service.code,
          title: service.title,
          description: service.description,
          tags: service.tags,
          icon: service.icon,
          color_class: service.colorClass,
          is_active: true,
          order: service.order,
          initial_message: service.initialMessage,
        }))
      )
      .select();

    if (servicesError) {
      console.error('❌ Error inserting services:', servicesError);
      throw servicesError;
    }

    console.log(`✅ Inserted ${servicesData?.length || 0} services\n`);

    // 2. Seed Base Prompt
    console.log('💬 Inserting base prompt...');
    const { data: basePromptData, error: basePromptError } = await supabase
      .from('prompts')
      .insert({
        type: 'base',
        service_code: null,
        content: BASE_PROMPT.trim(),
        is_active: true,
      })
      .select();

    if (basePromptError) {
      console.error('❌ Error inserting base prompt:', basePromptError);
      throw basePromptError;
    }

    console.log('✅ Inserted base prompt\n');

    // 3. Seed Service Prompts
    console.log('💬 Inserting service prompts...');
    const servicePromptsArray = Object.entries(SERVICE_PROMPTS).map(([code, content]) => ({
      type: 'service' as const,
      service_code: code,
      content: content.trim(),
      is_active: true,
    }));

    const { data: servicePromptsData, error: servicePromptsError } = await supabase
      .from('prompts')
      .insert(servicePromptsArray)
      .select();

    if (servicePromptsError) {
      console.error('❌ Error inserting service prompts:', servicePromptsError);
      throw servicePromptsError;
    }

    console.log(`✅ Inserted ${servicePromptsData?.length || 0} service prompts\n`);

    // 4. Seed Settings
    console.log('⚙️ Inserting settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .insert([
        {
          key: 'whatsapp_number',
          value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5500000000000',
        },
      ])
      .select();

    if (settingsError) {
      console.error('❌ Error inserting settings:', settingsError);
      throw settingsError;
    }

    console.log(`✅ Inserted ${settingsData?.length || 0} settings\n`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Services: ${servicesData?.length || 0}`);
    console.log(`   - Base Prompt: 1`);
    console.log(`   - Service Prompts: ${servicePromptsData?.length || 0}`);
    console.log(`   - Settings: ${settingsData?.length || 0}`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
