# Admin CRM - Setup Guide

Sistema de CRM integrado com IA para captura e qualificação de leads. O sistema inclui uma área administrativa completa para gerenciar leads, configurar serviços e customizar prompts da IA.

## 🚀 Setup Inicial

### 1. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie as credenciais do projeto (URL e Anon Key)
4. **IMPORTANTE**: Você também precisará da Service Role Key (Settings → API)

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Groq AI
GROQ_API_KEY=seu_groq_api_key_aqui
GROQ_MODEL=qwen/qwen3.8-27b

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Admin Authentication
ADMIN_PASSWORD=sua_senha_admin_segura

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 3. Aplicar Migrações do Banco de Dados

Existem duas opções:

#### Opção A: Supabase Local (Recomendado para desenvolvimento)

```bash
# Iniciar Supabase local
npx supabase start

# Aplicar migrações
npx supabase db push
```

#### Opção B: Supabase Cloud (Produção)

1. Vá para o SQL Editor no dashboard do Supabase
2. Copie e cole o conteúdo do arquivo `supabase/migrations/20260209000000_initial_schema.sql`
3. Execute o script

### 4. Popular o Banco de Dados

Execute o script de seed para popular o banco com os dados iniciais (serviços e prompts):

```bash
npm run seed
```

Você deverá ver uma saída como:
```
🌱 Starting database seed...
📋 Inserting services...
✅ Inserted 9 services
💬 Inserting base prompt...
✅ Inserted base prompt
💬 Inserting service prompts...
✅ Inserted 9 service prompts
⚙️ Inserting settings...
✅ Inserted 1 settings
🎉 Database seeded successfully!
```

### 5. Iniciar o Projeto

```bash
npm run dev
```

Acesse:
- Landing Page: http://localhost:3000
- Atendimento: http://localhost:3000/atendimento
- Admin: http://localhost:3000/admin

## 📋 Funcionalidades do Admin

### 1. Board de Leads (`/admin`)

- Visualizar todos os leads capturados
- Filtrar por status (Em Andamento, Quente, Frio, Contatado, Fechado, Perdido)
- Buscar por nome, telefone ou código
- Ver estatísticas (total, quentes, em andamento, taxa de conversão)
- Clicar em um lead para ver histórico completo de conversa
- Alterar status dos leads manualmente

### 2. Gerenciar Serviços (`/admin/services`)

- Listar todos os serviços cadastrados
- Criar novos serviços
- Editar serviços existentes:
  - Código (ex: "01", "02", etc.)
  - Título
  - Descrição
  - Tags
  - Ícone
  - Cor
  - Ordem de exibição
  - Mensagem inicial do chat
- Ativar/desativar serviços
- Serviços inativos não aparecem na landing page ou no fluxo de atendimento

### 3. Gerenciar Prompts (`/admin/prompts`)

**Prompt Base:**
- Define o comportamento geral da IA
- Regras de qualificação de leads
- Estilo de comunicação

**Prompts por Serviço:**
- Perguntas específicas para cada tipo de serviço
- Personalize a triagem para cada área do direito
- Melhore a qualificação dos leads

### 4. Configurações (`/admin/settings`)

- Número do WhatsApp (usado nos links quando lead é qualificado como quente)
- Outras configurações podem ser adicionadas no futuro

## 🔄 Fluxo do Lead

1. **Usuário acessa `/atendimento`**
   - Seleciona um serviço
   - Preenche nome e telefone

2. **Lead é criado no banco** (`status: em_andamento`)
   - Código único é gerado (ex: "A7X2K9")
   - Todas as mensagens são registradas

3. **Conversa com a IA**
   - IA faz perguntas baseadas no prompt de serviço
   - Avalia se é lead quente ou frio

4. **Qualificação automática**
   - **Lead Quente**: Status atualizado para `quente`, botão WhatsApp aparece com código do lead
   - **Lead Frio**: Status atualizado para `frio`, chat encerra sem WhatsApp

5. **Advogado visualiza no Admin**
   - Vê o lead no board
   - Acessa histórico completo
   - Atualiza status conforme contato (Contatado → Fechado/Perdido)

## 🔐 Segurança

- Área de admin protegida por senha (configurada em `ADMIN_PASSWORD`)
- Session cookies com httpOnly
- RLS (Row Level Security) habilitado no Supabase
- Service Role Key nunca exposta no browser (apenas no backend)

## 📱 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard da Vercel
3. Deploy automático em cada push

### Outras plataformas

Configure as mesmas variáveis de ambiente e certifique-se de que:
- Node.js 18+ está disponível
- Variáveis `NEXT_PUBLIC_*` são expostas no build
- Banco de dados Supabase está acessível

## 🛠️ Desenvolvimento

### Estrutura de Arquivos Importantes

```
app/
├── admin/                    # Área administrativa
│   ├── layout.tsx           # Layout com sidebar
│   ├── login/page.tsx       # Login do admin
│   ├── page.tsx             # Dashboard (board de leads)
│   ├── services/            # Gerenciamento de serviços
│   ├── prompts/             # Gerenciamento de prompts
│   └── settings/            # Configurações
├── api/
│   ├── leads/               # CRUD de leads
│   ├── admin/               # APIs protegidas do admin
│   ├── services/            # API pública de serviços
│   ├── prompts/             # API pública de prompts
│   └── chat/                # API do chat com IA
├── atendimento/             # Fluxo de atendimento
│   ├── components/          # Componentes do chat
│   └── hooks/               # useChat hook
lib/
├── supabase/                # Clientes Supabase
├── types/                   # TypeScript types
└── utils/                   # Utilitários (lead-code)
supabase/
└── migrations/              # Migrações SQL
scripts/
└── seed-supabase.ts         # Script de seed
```

### Adicionar Novo Status de Lead

1. Atualizar enum no banco: `supabase/migrations/...`
2. Adicionar tipo em `lib/types/database.ts`
3. Adicionar opção em `app/admin/components/LeadDetail.tsx`
4. Adicionar cor em `app/admin/components/LeadCard.tsx`
5. Adicionar filtro em `app/admin/page.tsx`

### Customizar Campos do Lead

1. Adicionar coluna na tabela `leads` via migration
2. Atualizar type `Lead` em `lib/types/database.ts`
3. Atualizar API `POST /api/leads`
4. Atualizar componente `LeadDetail.tsx`

## 🐛 Troubleshooting

**Erro: "Base prompt not found"**
- Execute `npm run seed` novamente

**Erro: "admin_session cookie not set"**
- Verifique se `ADMIN_PASSWORD` está configurado
- Limpe cookies e faça login novamente

**Leads não aparecem no admin:**
- Verifique se a API `/api/leads` retorna dados
- Confira RLS policies no Supabase

**Serviços não carregam na landing page:**
- Verifique se `is_active=true` no banco
- Confirme que API `/api/services` funciona

## 📚 Próximos Passos

- [ ] Adicionar paginação no board de leads
- [ ] Implementar filtro por data
- [ ] Exportar leads para CSV
- [ ] Notificações em tempo real (Supabase Realtime)
- [ ] Analytics e relatórios
- [ ] WhatsApp Business API integration
- [ ] Multi-tenancy (múltiplos advogados)

## 📄 Licença

Projeto privado - Todos os direitos reservados.
