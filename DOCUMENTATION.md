# DOCUMENTATION.md — HighFlow Platform

> Blueprint completo para reconstrução fiel do protótipo HighFlow.

---

## 1. VISÃO GERAL DO PRODUTO

### Nome
**HighFlow** — Plataforma High-Ticket

### Propósito
HighFlow é uma plataforma SaaS completa para gestão de operações de vendas high-ticket. Ela centraliza CRM, comunicação multicanal, gestão de equipe comercial, monetização (eventos + pitches), entrega de cursos/mentorias e infraestrutura operacional em um único painel.

### Problema que Resolve
Produtores digitais e empresas de high-ticket precisam gerenciar leads, equipes de vendas (SDRs e Closers), eventos presenciais/online, pitches de vendas com QR codes, mentorias com métricas de engajamento (IEM), e comunicação multicanal — tudo isso normalmente fragmentado em dezenas de ferramentas.

### Público-Alvo

| Papel | Descrição |
|-------|-----------|
| Admin (Produtor) | Dono da operação, acesso total |
| Gestor | Gerencia equipes e relatórios |
| Closer | Vendedor que fecha negócios high-ticket |
| SDR | Pré-vendedor que qualifica e agenda reuniões |
| Financeiro | Gerencia comissões e pagamentos |
| Suporte | Atendimento ao cliente |
| Mentor | Conduz mentorias e avalia mentorados |
| Mentorado | Participa de mentorias (visão aluno) |
| Aluno | Consome cursos online |

### Fluxo Principal de Uso

1. Usuário acessa `/auth` → faz login com email/senha
2. Redirecionado para `/` (Dashboard — Visão Geral)
3. Sidebar esquerda com 7 pilares de navegação
4. Dashboard exibe ações do dia, leads quentes, gargalos de funil, pagamentos em risco
5. Navega para CRM → Pipeline para gerenciar leads
6. Registra atividades comerciais na ficha do lead
7. Acompanha performance da equipe em Comercial
8. Gerencia eventos e pitches em Monetização
9. Acompanha mentorias e cursos em Experiência

---

## 2. DESIGN SYSTEM

### Paleta de Cores (HSL — CSS Variables)

#### Light Mode (`:root`)

| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | `0 0% 100%` | Fundo principal |
| `--foreground` | `222 47% 11%` | Texto principal |
| `--card` | `0 0% 100%` | Fundo de cards |
| `--card-foreground` | `222 47% 11%` | Texto de cards |
| `--popover` | `0 0% 100%` | Fundo de popovers |
| `--popover-foreground` | `222 47% 11%` | Texto de popovers |
| `--primary` | `221 83% 53%` | Azul principal (botões, links, destaques) |
| `--primary-foreground` | `0 0% 100%` | Texto sobre primário |
| `--secondary` | `160 84% 39%` | Verde secundário (sucesso, valores positivos) |
| `--secondary-foreground` | `0 0% 100%` | Texto sobre secundário |
| `--muted` | `210 40% 96%` | Fundos suaves, áreas inativas |
| `--muted-foreground` | `215 16% 47%` | Texto secundário/desabilitado |
| `--accent` | `38 92% 50%` | Laranja/âmbar (alertas, destaques) |
| `--accent-foreground` | `0 0% 100%` | Texto sobre accent |
| `--destructive` | `0 84% 60%` | Vermelho (erros, exclusão, perdas) |
| `--destructive-foreground` | `0 0% 100%` | Texto sobre destructive |
| `--border` | `214 32% 91%` | Bordas gerais |
| `--input` | `214 32% 91%` | Bordas de inputs |
| `--ring` | `221 83% 53%` | Anel de foco |
| `--success` | `160 84% 39%` | Verde sucesso |
| `--success-foreground` | `0 0% 100%` | Texto sobre sucesso |

#### Sidebar

| Token | HSL |
|-------|-----|
| `--sidebar-background` | `222 47% 11%` (dark navy) |
| `--sidebar-foreground` | `210 40% 98%` |
| `--sidebar-primary` | `221 83% 53%` |
| `--sidebar-accent` | `217 33% 17%` |
| `--sidebar-border` | `217 33% 17%` |

#### Chart Colors

| Token | HSL | Cor |
|-------|-----|-----|
| `--chart-1` | `221 83% 53%` | Azul |
| `--chart-2` | `160 84% 39%` | Verde |
| `--chart-3` | `38 92% 50%` | Laranja |
| `--chart-4` | `280 65% 60%` | Roxo |
| `--chart-5` | `340 75% 55%` | Rosa |

#### Gradientes

```css
--gradient-primary: linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(221 83% 63%) 100%);
--gradient-secondary: linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(160 84% 49%) 100%);
--gradient-hero: linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(160 84% 39%) 100%);
```

#### Dark Mode (`.dark`)

| Token | HSL |
|-------|-----|
| `--background` | `222 47% 11%` |
| `--foreground` | `210 40% 98%` |
| `--card` | `217 33% 17%` |
| `--muted` | `217 33% 17%` |
| `--muted-foreground` | `215 20% 65%` |
| `--border` | `217 33% 17%` |
| `--destructive` | `0 63% 31%` |

### Tipografia

- **Font family**: Sistema padrão do Tailwind (sem fonte custom importada — usa a stack nativa do navegador)
- **Títulos de página (h1)**: `text-3xl font-bold text-foreground` (≈30px)
- **Subtítulos de página**: `text-muted-foreground` (corpo normal)
- **Títulos de seção (h2)**: `text-2xl font-bold` ou `text-xl font-semibold`
- **Títulos de card**: `text-lg font-semibold` ou `text-base font-medium`
- **Corpo**: `text-sm` (14px)
- **Labels**: `text-xs` ou `text-sm text-muted-foreground`
- **Métricas grandes**: `text-2xl font-bold` ou `text-3xl font-bold`
- **Badges**: `text-xs`

### Espaçamento e Layout

- **Border radius**: `--radius: 0.5rem` (8px)
- **Espaçamento entre seções**: `space-y-6` (24px)
- **Gap de grids**: `gap-4` (16px) ou `gap-6` (24px)
- **Padding de cards**: `p-4` ou `p-6`
- **Padding do main**: `p-6`
- **Header height**: `h-16` (64px)

### Sombras

- Cards com hover: `hover:shadow-lg transition-all`
- MetricCard: `border-2` + `hover:shadow-lg`

### Componentes shadcn/ui Utilizados

| Componente | Localização |
|------------|-------------|
| Accordion | `@/components/ui/accordion` |
| Alert Dialog | `@/components/ui/alert-dialog` |
| Alert | `@/components/ui/alert` |
| Aspect Ratio | `@/components/ui/aspect-ratio` |
| Avatar | `@/components/ui/avatar` |
| Badge | `@/components/ui/badge` |
| Breadcrumb | `@/components/ui/breadcrumb` |
| Button | `@/components/ui/button` |
| Calendar | `@/components/ui/calendar` |
| Card | `@/components/ui/card` |
| Carousel | `@/components/ui/carousel` |
| Chart | `@/components/ui/chart` |
| Checkbox | `@/components/ui/checkbox` |
| Collapsible | `@/components/ui/collapsible` |
| Command | `@/components/ui/command` |
| Context Menu | `@/components/ui/context-menu` |
| Dialog | `@/components/ui/dialog` |
| Drawer | `@/components/ui/drawer` |
| Dropdown Menu | `@/components/ui/dropdown-menu` |
| Form | `@/components/ui/form` |
| Hover Card | `@/components/ui/hover-card` |
| Input OTP | `@/components/ui/input-otp` |
| Input | `@/components/ui/input` |
| Label | `@/components/ui/label` |
| Menubar | `@/components/ui/menubar` |
| Navigation Menu | `@/components/ui/navigation-menu` |
| Pagination | `@/components/ui/pagination` |
| Popover | `@/components/ui/popover` |
| Progress | `@/components/ui/progress` |
| Radio Group | `@/components/ui/radio-group` |
| Resizable | `@/components/ui/resizable` |
| Scroll Area | `@/components/ui/scroll-area` |
| Select | `@/components/ui/select` |
| Separator | `@/components/ui/separator` |
| Sheet | `@/components/ui/sheet` |
| Sidebar | `@/components/ui/sidebar` |
| Skeleton | `@/components/ui/skeleton` |
| Slider | `@/components/ui/slider` |
| Sonner | `@/components/ui/sonner` |
| Switch | `@/components/ui/switch` |
| Table | `@/components/ui/table` |
| Tabs | `@/components/ui/tabs` |
| Textarea | `@/components/ui/textarea` |
| Toast | `@/components/ui/toast` |
| Toggle Group | `@/components/ui/toggle-group` |
| Toggle | `@/components/ui/toggle` |
| Tooltip | `@/components/ui/tooltip` |

### Padrões Visuais Recorrentes

#### Cards
- Sempre usando `<Card>` com `<CardHeader>` e `<CardContent>`
- Variante com borda lateral colorida: `border-l-4 border-l-primary`
- Hover interativo: `hover:bg-muted/50 transition-colors cursor-pointer`
- Cards de métrica: `border-2 hover:shadow-lg` com gradiente sutil de fundo

#### Badges
- Status: cores semânticas (verde=ativo, amarelo=pendente, vermelho=erro, azul=agendado, cinza=concluído)
- Score/IEM: `variant="outline"` com cor roxa para IEM
- Módulos: `variant="secondary"` pequenos

#### Tabelas
- Sempre dentro de Card, usando `<Table>` do shadcn
- Headers em cinza, linhas com hover
- Ações na última coluna (botões ghost/icon)

#### Formulários
- Sempre em Dialog/modal
- Labels + Inputs em grid `grid-cols-2 gap-4`
- Botões no DialogFooter: Cancelar (outline) + Ação (primary)
- Validação com Zod no Auth

#### Modais
- `<Dialog>` com `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogFooter>`
- Sempre com botão cancelar + ação principal

#### Estados Vazios
- Ícone grande centralizado (`h-12 w-12 text-muted-foreground/50`)
- Texto descritivo
- CTA button abaixo

#### Estados de Loading
- `<Loader2 className="animate-spin" />` centralizado
- Texto "Carregando..." em `text-muted-foreground`

#### Gráficos
- Recharts: `ResponsiveContainer` com height=300
- BarChart, LineChart, PieChart
- Cores usando `hsl(var(--chart-N))` ou `hsl(var(--primary))`

---

## 3. ARQUITETURA E NAVEGAÇÃO

### Estrutura de Rotas (App.tsx)

```
/auth                        → Auth (login/cadastro)

/* Rotas protegidas (AppLayout) */
/                            → Dashboard (Visão Geral)

/* Performance */
/performance/relatorios      → Relatorios
/performance/indicadores     → Dashboard (reusado)

/* CRM */
/crm/pipeline                → Pipeline
/crm/leads                   → LeadsList
/crm/lead                    → LeadDetail
/crm/lead/:id                → LeadDetail

/* Comercial */
/comercial/equipe            → Equipe
/comercial/atividades        → Atividades
/comercial/produtividade     → PerformanceComercial
/comercial/performance       → PerformanceComercial
/comercial/comissoes         → Comissoes
/comercial/agenda            → Agenda
/comercial/relatorios        → Relatorios

/* Eventos / Monetização */
/eventos                     → EventosList
/eventos/detalhe             → EventoDetail
/eventos/detalhe/:id         → EventoDetail
/eventos/pitch               → PitchEditor
/eventos/pitch/:id           → PitchEditor
/eventos/estrategias         → ConstrutorEstrategias

/* Comunicação */
/comunicacao/campanhas       → Campanhas
/comunicacao/automacoes      → Automacoes
/comunicacao/editor          → EditorMensagens
/comunicacao/conversas       → Conversas

/* Entrega / Experiência */
/entrega/cursos              → MeusCursos
/entrega/mentorias           → MinhasMentorias
/entrega/mentorias/:id       → MinhasMentorias
/entrega/mentorias-ht        → MinhasMentorias
/entrega/mentor              → PainelMentor
/entrega/produtor            → PainelProdutor

/* Conexões */
/conexoes                    → Conexoes

/* Infraestrutura */
/infra/seguranca             → Seguranca
/infra/configuracoes         → Configuracoes

/* 404 */
*                            → NotFound
```

### Hierarquia da Sidebar

A sidebar é um componente escuro (navy `222 47% 11%`) com logo "HighFlow" no topo e 7 seções colapsáveis:

```
📊 Performance
  └─ Performance (LayoutDashboard)
       ├─ Visão Geral (Eye) → /
       ├─ Relatórios (FileBarChart) → /performance/relatorios
       └─ Indicadores (BarChart3) → /performance/indicadores

👥 Relacionamento
  ├─ CRM (Users)
  │    ├─ Pipeline (Kanban) → /crm/pipeline
  │    └─ Lista de Leads (List) → /crm/leads
  └─ Comunicação (MessageSquare)
       ├─ Campanhas (Megaphone) → /comunicacao/campanhas
       ├─ Automações (Zap) → /comunicacao/automacoes
       ├─ Editor de Mensagens (PenTool) → /comunicacao/editor
       └─ Conversas (WhatsApp) (MessageCircle) → /comunicacao/conversas

📞 Comercial
  └─ Operação Comercial (PhoneCall)
       ├─ Equipe (UsersRound) → /comercial/equipe
       ├─ Atividades (Activity) → /comercial/atividades
       ├─ Produtividade (Gauge) → /comercial/produtividade
       ├─ Comissões (DollarSign) → /comercial/comissoes
       ├─ Agenda (Calendar) → /comercial/agenda
       └─ Relatórios (FileBarChart) → /comercial/relatorios

💰 Monetização
  └─ Monetização (TrendingUp)
       ├─ Produtos (DollarSign) → /eventos/pitch
       └─ Construtor de Estratégias (Sparkles) → /eventos/estrategias

🏛 Experiência
  └─ Experiência (GraduationCap)
       ├─ Meus Cursos (BookOpen) → /entrega/cursos
       ├─ Minhas Mentorias (Heart) → /entrega/mentorias
       ├─ Mentorias High Ticket (Crown) → /entrega/mentorias-ht
       ├─ Eventos (CalendarDays) → /eventos
       ├─ Painel do Mentor (UserCog) → /entrega/mentor
       └─ Painel do Produtor (Crown) → /entrega/produtor

⚙️ Infraestrutura
  └─ Infraestrutura (Plug)
       ├─ Integrações (Plug) → /conexoes
       ├─ Segurança (Shield) → /infra/seguranca
       └─ Configurações (Settings) → /infra/configuracoes

[Rodapé]
  Email do usuário
  Botão "Sair" (LogOut)
```

Cada grupo usa `<Collapsible>` com `defaultOpen` baseado na rota ativa. A sidebar suporta estado expandido/colapsado via `SidebarTrigger`.

### Lógica de Autenticação

1. **AuthProvider** envolve toda a aplicação (dentro de BrowserRouter)
2. Usa `supabase.auth.onAuthStateChange` para escutar mudanças de sessão
3. Verifica sessão existente com `supabase.auth.getSession()`
4. **ProtectedRoute** verifica `user` — se null, redireciona para `/auth`
5. Mostra `<Loader2>` enquanto `loading=true`
6. `/auth` redireciona para `/` se já autenticado (via useEffect)
7. Validação com Zod: email válido + senha mínimo 6 caracteres
8. Suporta login e cadastro (toggle na mesma página)

### Providers Globais

```tsx
<QueryClientProvider client={queryClient}>    // React Query
  <TooltipProvider>                            // Tooltips
    <Toaster />                                // Toast notifications (radix)
    <Sonner />                                 // Toast notifications (sonner)
    <BrowserRouter>                            // React Router
      <AuthProvider>                           // Auth context (Supabase)
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <GlobalFilterProvider>           // Filtros globais
                <SidebarProvider>              // Estado sidebar
                  <AppLayout />
                </SidebarProvider>
              </GlobalFilterProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

---

## 4. DOCUMENTAÇÃO POR MÓDULO E TELA

### 4.1 Auth — `/auth`

**Propósito**: Login e cadastro de usuários.

**Layout**: Card centralizado na tela com logo "HighFlow" + Sparkles icon.

**Componentes**:
- Logo + título "HighFlow"
- Toggle login/cadastro (texto clicável)
- Input email + Input senha
- Botão submit com loading spinner
- Mensagens de erro inline (Zod)
- Toasts para feedback

**Dados**:
- email: string (validado como email)
- password: string (min 6 chars)

**Estados**:
- Default: formulário de login
- Cadastro: toggle para modo signup
- Loading: spinner no botão
- Erro: mensagem inline + toast

**Ações**:
- Entrar → `signIn(email, password)`
- Criar Conta → `signUp(email, password)`
- Toggle login/signup

**Integração Supabase**: `supabase.auth.signInWithPassword`, `supabase.auth.signUp`

---

### 4.2 Dashboard (Visão Geral) — `/`

**Propósito**: Painel centralizado com visão executiva da operação high-ticket.

**Layout**: Header (título + descrição) → GlobalContextSelector → 4 cards de ações/riscos → Funil multi-funil → 4 MetricCards → 4 cards de performance → 2 gráficos lado a lado → Gráfico de evolução → 2 cards de atalho

**Componentes**:
1. **Ações de Hoje** (card border-l-4 primary): Lista de follow-ups com indicador de atraso
2. **Leads Quentes Parados** (card border-l-4 accent): Leads estagnados com dias na etapa
3. **Gargalo do Funil** (card border-l-4 destructive): Maior queda de conversão (-50% Warm→Call)
4. **Pagamentos em Risco** (card border-l-4 chart-4): PIX expirando, cartão recusado
5. **Funil de Vendas Multi-funil**: Funil visual com 4 níveis (Leads→Low Ticket→Eventos→Mentorias) usando `clipPath: polygon` para formato de trapézio
6. **MetricCards**: Receita Total, Leads Ativos, Taxa de Conversão, Ticket Médio
7. **Cards de Performance**: CAC Médio, LTV Médio, CAC/LTV, ROI
8. **BarChart horizontal**: Funil de Conversão (Lead Frio → Fechou)
9. **PieChart**: Leads por Origem (Instagram, Facebook, LinkedIn, Indicação)
10. **LineChart dual axis**: Evolução Receita + Leads
11. **Eventos Ativos**: Link para `/eventos`
12. **Produtividade dos Closers**: Link para `/comercial/produtividade`

**Dados (mock)**:
```json
{
  "todayActions": [{"type": "Follow-up", "lead": "Maria Santos", "time": "10:00", "overdue": true}],
  "hotLeadsAging": [{"name": "Lucia Ferreira", "stage": "Follow-up", "days": 5, "value": 20000}],
  "funnelData": [{"stage": "Lead Frio", "count": 1200}, {"stage": "Fechou", "count": 76}],
  "revenueData": [{"month": "Jan", "revenue": 145000, "leads": 45}],
  "sourceData": [{"name": "Instagram", "value": 42}],
  "metrics": {"receita": "R$ 1.54M", "leads": 487, "conversao": "6.3%", "ticket": "R$ 18.7k"}
}
```

**Filtros**: GlobalContextSelector (Período, Evento, Pipeline, Time, Origem)

**Navegação**: Links para `/comercial/atividades`, `/crm/pipeline`, `/performance/relatorios`, `/eventos/pitch`, `/eventos`, `/comercial/produtividade`

---

### 4.3 Pipeline CRM — `/crm/pipeline`

**Propósito**: Visão Kanban dos leads por etapa do funil.

**Layout**: Header + GlobalContextSelector + resumo + 9 colunas Kanban scrolláveis horizontalmente

**Componentes**:
- 3 MetricCards no topo (Total Leads, Valor Pipeline, Score Médio)
- 9 colunas: Lead Frio, Engajado, Warm, Agendou, Call Agendada, Call Realizada, Follow-up, Fechou, Onboarding
- Cada coluna: título com bolinha colorida + badge de contagem + valor total
- Cards de lead: Avatar, nome, origem, Score, IEM (roxo), responsável, valor, último contato, pitch associado, botões de ação (telefone, email, WhatsApp)
- Estado vazio por coluna: ícone Inbox + "Nenhum lead nesta etapa"

**Dados (mock)**:
```json
{
  "leads": [
    {"id": 1, "name": "João Silva", "stage": "engajado", "score": 85, "iem": 78, "value": 15000, "origin": "Meta Ads", "lastContact": "2h", "pitch": "Mentoria Elite", "responsible": "Ana Ribeiro"}
  ]
}
```

**Cores das etapas**:
- Lead Frio: slate-500, Engajado: blue-500, Warm: yellow-500, Agendou: orange-500
- Call Agendada: purple-500, Call Realizada: indigo-500, Follow-up: pink-500
- Fechou: green-500, Onboarding: emerald-500

**Ações**: Clicar card → `/crm/lead/:id`; Botões "Filtrar" e "+ Novo Lead"

---

### 4.4 Lista de Leads — `/crm/leads`

**Propósito**: Visão tabular/operacional de todos os leads.

**Layout**: Header + GlobalContextSelector + LeadSourceSelector + Tabela

**Componentes**:
- Botões "Exportar" e "+ Novo Lead"
- `LeadSourceSelector`: Radio (CRM / Produtos conectados) + seleção de plataforma/produto
- Barra de busca + botão Filtros
- Tabela com colunas: Lead (avatar+nome), Origem, Responsável, Etapa (bolinha colorida), Score (badge), IEM (badge roxo), Valor Potencial (verde), Última Interação, Próxima Ação, Ação (eye → ficha)
- Estado vazio: ícone Inbox + texto + CTA

**Navegação**: Clique em olho → `/crm/lead/:id`

**Integração Supabase**: `lead_sources` (SELECT), `connections` (SELECT) — via LeadSourceSelector

---

### 4.5 Ficha do Lead — `/crm/lead/:id`

**Propósito**: Visão 360° do lead com timeline, dados comerciais, compras, eventos, cursos e mentorias.

**Layout**: Grid 3 colunas (2+1). Esquerda: header do lead + 4 MetricCards + Tabs. Direita: Ações Rápidas + Sugestões IA + Responsável + Informações.

**Tabs**:
1. **Timeline**: Lista de eventos com data/hora
2. **Comercial** (LeadComercialTab): Status comercial, SDR/Closer atribuídos, ações (atribuir, registrar atividade, fechar venda), timeline de atividades, deals
3. **Histórico SUN**: Compras com produto, valor e status
4. **Eventos**: Eventos do lead com status (Confirmado/Pendente)
5. **Cursos**: Progresso em cursos (barra de progresso)
6. **Mentorias**: Mentorias com IEM e próxima sessão

**Sidebar Direita**:
- Ações Rápidas: Enviar Link SUN (WhatsApp), (Email), Gerar QR Code, Inscrever em Evento
- Sugestões da IA: Próxima ação, Melhor pitch, Melhor canal (card com fundo primary/5)
- Responsável: Avatar SDR → seta → Avatar Closer (handoff visual)
- Informações: Telefone, Origem, Criado em, Última interação, Pitch

**Integração Supabase (via LeadComercialTab)**:
- `sales_users` (SELECT ativos)
- `lead_assignments` (SELECT, INSERT, UPDATE)
- `sales_activities` (SELECT, INSERT)
- `deals` (SELECT, INSERT)
- `commission_records` (INSERT — automático ao fechar venda)

---

### 4.6 Campanhas — `/comunicacao/campanhas`

**Propósito**: Gerenciar campanhas de comunicação multicanal (WhatsApp, Email, SMS).

**Layout**: Header + 4 MetricCards + Lista de campanhas

**Componentes**:
- MetricCards: Total Enviados, Conversões, Taxa Conversão, Receita Gerada
- Cards de campanha: ícone do canal, nome, status (badge colorido), barras de abertura/cliques, conversões, receita
- Status: Ativa (verde), Pausada (amarelo), Rascunho (cinza), Concluída (azul)

**Dados (mock)**: 4 campanhas com sent, opened, clicked, converted, revenue

---

### 4.7 Automações — `/comunicacao/automacoes`

**Propósito**: Configurar gatilhos automáticos para engajamento.

**Layout**: Header + Grid 2 colunas de cards

**Componentes**:
- Card por automação: ícone, nome, trigger, switch ativo/inativo, badges de canais, métricas (execuções, conversões), botão "Editar"
- 6 automações mock: Boas-vindas Evento, Lead Engajado, Carrinho Abandonado SUN, Follow-up Pitch, Onboarding Mentoria, Reengajamento IEM

---

### 4.8 Editor de Mensagens — `/comunicacao/editor`

**Propósito**: Criar mensagens personalizadas com placeholders e sugestões de IA.

**Layout**: Grid 3 colunas (2+1). Esquerda: config + editor. Direita: sugestões IA + dicas.

**Componentes**:
- Config: nome da mensagem + select de canal (WhatsApp/Email/SMS)
- Textarea monospace com placeholders clicáveis: `{{nome}}`, `{{evento}}`, `{{pitch}}`, `{{link_sun}}`, `{{data}}`, `{{preco}}`, `{{bonus}}`
- Pré-visualização com valores substituídos
- Sidebar: 3 sugestões IA (Urgência, Personalizada, Follow-up) clicáveis + botão "Gerar Nova Sugestão" + card de dicas

---

### 4.9 Conversas (WhatsApp) — `/comunicacao/conversas`

**Propósito**: Central de atendimento e vendas via WhatsApp.

**Layout**: Grid 4 colunas. 1: lista conversas. 2: chat ativo. 1: ações rápidas.

**Componentes**:
- Lista de conversas: avatar, nome, última mensagem, tempo, badge de não lidas
- Chat: header com nome/telefone/stage, mensagens (balões azul=closer, cinza=lead), input de envio
- Ações rápidas: enviar links SUN, gerar QR Code, agendar call, sugestão IA

---

### 4.10 Equipe Comercial — `/comercial/equipe`

**Propósito**: CRUD de SDRs, Closers e Líderes.

**Layout**: Header + 3 cards resumo + Tabela

**Componentes**:
- 3 cards: contagem de SDRs, Closers, Líderes ativos
- Tabela: Nome, Função, E-mail, Meta Mensal, Comissão (%), Status, Ações (editar/toggle status)
- Dialog de criação/edição: Nome, Função, Email, Telefone, Tipo Comissão (Percentual/Fixo/Híbrido), % Comissão, Valor Fixo, Meta Mensal, Custo Fixo
- Estado vazio: "Nenhum profissional cadastrado"

**Integração Supabase**: `sales_users` (SELECT, INSERT, UPDATE)

---

### 4.11 Atividades Comerciais — `/comercial/atividades`

**Propósito**: Central de atividades da equipe comercial.

**Layout**: Header + filtro por tipo + 3 cards resumo + Tabs (A Fazer / Concluídas) + Tabela

**Componentes**:
- Select de filtro: Todos, Ligação, WhatsApp, Follow-up, etc.
- Cards: Total, A Fazer (amarelo), Concluídas (verde)
- Tabela: Tipo (ícone), Profissional, Lead (link), Data, Status (badge), Resultado

**Integração Supabase**: `sales_activities` (SELECT com join `sales_users`)

---

### 4.12 Performance Comercial — `/comercial/produtividade`

**Propósito**: KPIs da equipe e individuais.

**Layout**: Header + 4+4 MetricCards + Tabela por profissional

**Métricas**: Contatos, Reuniões Agendadas, Realizadas, Fechamentos, Receita, Ticket Médio, Taxa Fechamento, Taxa Comparecimento

**Tabela**: Profissional, Função, Contatos, Reuniões, Fechamentos, Receita, Taxa Fech.

**Integração Supabase**: `sales_users`, `sales_activities`, `deals` (SELECT)

---

### 4.13 Comissões — `/comercial/comissoes`

**Propósito**: Gestão de comissões (Estimadas → Aprovadas → Pagas).

**Layout**: Header + filtro + 3 cards (totais por status) + Tabela

**Componentes**:
- Cards: Estimadas (amarelo), Aprovadas (azul), Pagas (verde)
- Tabela: Profissional, Função, Valor Deal, Comissão, Período, Status, Ações (Aprovar/Pagar)

**Integração Supabase**: `commission_records` (SELECT, UPDATE) com join `sales_users`, `deals`

---

### 4.14 Agenda Comercial — `/comercial/agenda`

**Propósito**: Atividades planejadas da equipe.

**Layout**: Header + filtro por profissional + 2 cards (Hoje/Próximas) + Lista agrupada

**Componentes**:
- Select de profissional
- Seção "Hoje": atividades do dia com tipo, profissional, horário, link para lead
- Seção "Próximas": atividades futuras
- Estado vazio: "Nenhuma atividade agendada"

**Integração Supabase**: `sales_users` (SELECT), `sales_activities` (SELECT onde status=planned, ordenado por scheduled_at)

---

### 4.15 Relatórios Comerciais — `/comercial/relatorios` e `/performance/relatorios`

**Propósito**: Análises consolidadas da operação comercial.

**Layout**: Header + 3 cards resumo + Tabela receita por profissional + Motivos de perda

**Componentes**:
- Cards: Taxa No-show, Deals Perdidos, Receita Total
- Tabela: Profissional, Função, Deals, Receita, Custo Fixo, Resultado (verde/vermelho)
- Motivos de Perda: lista ordenada por frequência

**Integração Supabase**: `sales_users`, `deals`, `sales_activities` (SELECT)

---

### 4.16 Eventos & Pitches — `/eventos`

**Propósito**: Listar e gerenciar eventos Blinket.

**Layout**: Header + 4 MetricCards + Lista de eventos

**Componentes**:
- MetricCards: Total Eventos, Inscritos, Receita Total, Conversão Média
- Cards de evento: ícone calendário, nome, status (badge), data/hora, inscritos, check-ins, receita, pitches
- Busca de eventos

**Navegação**: Clicar → `/eventos/detalhe/:id`

---

### 4.17 Detalhe do Evento — `/eventos/detalhe/:id`

**Propósito**: Visão completa de um evento com pitches, participantes e engajamento.

**Layout**: Header + 5 MetricCards + Tabs

**Tabs**:
1. **Pitches**: Cards de pitch (nome, preço, conversões, receita, QR code) + link para pitch editor
2. **Participantes**: Lista com avatar, check-in badge, engajamento %
3. **Engajamento Pré** (Blinket): Pesquisa, Enquete, Confirmação com barras de progresso
4. **Engajamento Durante**: 3 cards (Perguntas, Reações, QR scans)
5. **Métricas**: Conversão por pitch (barras) + Métricas financeiras (CAC, LTV, CAC/LTV, ROAS)

---

### 4.18 Editor de Pitch — `/eventos/pitch/:id`

**Propósito**: Configurar detalhes de um pitch de vendas.

**Layout**: Grid 3 colunas (2+1). Esquerda: info básica + lotes + bônus + pagamento. Direita: urgência + links SUN + enviar para leads.

**Componentes**:
- Info Básica: Nome, Tipo (Mentoria/Curso/Mastermind/Consultoria), Descrição, Preço Base
- Lotes: lista com nome, preço, vagas, status (Ativo/Esgotado/Próximo)
- Bônus: nome + valor
- Pagamento: toggles (Cartão, PIX Parcelado, Boleto Parcelado) + select de parcelas
- Urgência: toggle + tipo (Cronômetro/Vagas/Preço) + duração
- Links SUN: cards com tipo (Cartão/PIX/Boleto), URL, botões copiar/fullscreen, QR code placeholder
- QR Code fullscreen modal (overlay branco)

---

### 4.19 Construtor de Estratégias — `/eventos/estrategias`

**Propósito**: Editor visual de jornadas de vendas usando nós e conexões (flow builder).

**Layout**: Header compacto + Canvas ReactFlow fullscreen

**Componentes**:
- Input editável para nome da estratégia
- Botões: Nova, Carregar (dialog com lista), Excluir selecionados, Salvar
- Canvas ReactFlow com nós customizados (StrategyNode)
- ElementPanel (painel retrátil): 9 tipos de elementos (Base de Leads, Low-Ticket, CRM, Evento Blinket, Pitch, Checkout SUN, Mentoria, Curso, Produto Físico)
- MiniMap + Controls + Background dots
- Dica no canto: "Duplo-clique para editar • Arraste para conectar"

**Tipos de Nó** (StrategyNode):

| Tipo | Cor | Ícone |
|------|-----|-------|
| base-leads | cyan-500 | Database |
| low-ticket | blue-500 | ShoppingCart |
| crm | indigo-500 | Megaphone |
| evento | purple-500 | Calendar |
| pitch | orange-500 | Target |
| checkout | emerald-500 | CreditCard |
| mentoria | green-500 | Heart |
| curso | teal-500 | GraduationCap |
| produto-fisico | pink-500 | Package |

Cada nó exibe: ícone colorido, label editável, badge de tipo, métricas (leads + conversão).
Edges exibem taxa de conversão calculada automaticamente.

**Integração Supabase**: `strategies` (SELECT, INSERT, UPDATE, DELETE)

---

### 4.20 Meus Cursos — `/entrega/cursos`

**Propósito**: Visão do aluno dos cursos Nutror/Alpaclass.

**Layout**: Header + 3 cards resumo + Grid 2 colunas de cards de curso

**Componentes**:
- Cards resumo: Total Cursos, Concluídos, Certificados
- Card de curso: barra de progresso no topo, nome, plataforma (badge), progresso %, módulos (X/Y), duração, último acesso, botão (Iniciar/Continuar/Ver Certificado)
- Badge "Certificado" (amarelo) para cursos concluídos

---

### 4.21 Minhas Mentorias — `/entrega/mentorias`

**Propósito**: Acompanhamento do mentorado em sua mentoria.

**Layout**: Header + Card da mentoria (nome, mentor, IEM) + Card próxima sessão + Tabs

**Tabs**:
1. **Cronograma**: Lista numerada de sessões com status (Concluído/Próximo/Agendado)
2. **Tarefas**: Lista com título, prazo, status, nota, botão "Entregar"
3. **Materiais**: Lista de arquivos com tipo/tamanho e botão "Baixar"
4. **Gravações**: Lista de sessões gravadas com duração e botão "Assistir"
5. **Meu IEM**: Evolução semanal (barras de progresso) + Dicas para melhorar

**Métricas exclusivas**: IEM (Índice de Engajamento do Mentorado) — roxo, texto grande

---

### 4.22 Painel do Mentor — `/entrega/mentor`

**Propósito**: Gestão de turmas e mentorados pelo mentor.

**Layout**: Header + Seleção de turma (cards clicáveis) + Tabs

**Componentes**:
- Cards de turma: nome, qtd alunos, IEM médio, próxima sessão. Selecionada = border-primary
- Tabs:
  1. **Mentorados**: Lista com avatar, presença %, tarefas entregues, IEM (verde/amarelo/vermelho), link para ficha
  2. **Presença**: Sessões com data, tema, contagem de presentes, badge, botão "Registrar Presença"
  3. **Tarefas Pendentes**: Entregas para avaliar (aluno, tarefa, data envio, botão "Avaliar")
  4. **Materiais**: Upload e gerenciamento de materiais (Planilhas, PDFs)

---

### 4.23 Painel do Produtor — `/entrega/produtor`

**Propósito**: Visão executiva de todas as mentorias e cursos.

**Layout**: Header + 6 MetricCards + Grid (2+1): lista de mentorias + distribuição IEM

**Componentes**:
- MetricCards: Mentorias Ativas, Total Mentorados, IEM Médio, Receita Mentorias, Cursos Ativos, Total Alunos
- Cards de mentoria: nome, mentor (badge), mentorados, próxima sessão, IEM médio, receita, link "Ver Detalhes"
- Distribuição do IEM: 4 faixas (90-100%, 70-89%, 50-69%, <50%) com barras coloridas
- Resumo: % acima de 70% (verde) + % em risco (vermelho)
- Ações Rápidas: Criar Mentoria, Adicionar Curso, Gerenciar Mentores

---

### 4.24 Conexões — `/conexoes`

**Propósito**: Gerenciar integrações com plataformas externas.

**Layout**: Header + Grid de cards de provedores

**Provedores**:

| Provedor | Disponível |
|----------|-----------|
| Eduzz | Sim |
| Hotmart | Não (Em breve) |
| Kiwify | Não (Em breve) |
| ActiveCampaign | Não (Em breve) |
| ManyChat | Não (Em breve) |
| Meta (Business) | Não (Em breve) |

**Componentes**:
- Card por provedor: nome, descrição, status (Conectado/Não conectado/Token expirado), última sincronização
- Botões: Conectar / Reconectar / Desconectar
- Dialog de conexão: input de API Key (password) + botões Cancelar/Conectar
- Providers indisponíveis: opacity-60 + badge "Em breve"

**Integração Supabase**: `connections` (SELECT, INSERT, UPDATE)

---

### 4.25 Segurança — `/infra/seguranca`

**Propósito**: Gerenciar acessos, auditoria e alertas de risco.

**Layout**: Header (Shield icon) + 3 Tabs

**Tab A — Acessos e Permissões**:
- Botão "Convidar usuário"
- Tabela: Usuário (nome+email), Papel (badge colorido), Módulos (badges secondary), Escopo, Ações ("Editar permissões")
- Papéis: Admin, SDR, Closer, Gestor (com cores distintas)

**Tab B — Auditoria**:
- Botão "Exportar auditoria"
- Tabela: Data/Hora, Usuário, Ação, Detalhes

**Tab C — Risco e Alertas**:
- 3 cards de alertas: chargeback (borda destructive), pagamentos falhando, login suspeito
- Regras de Segurança (switches): "Exigir aprovação para comissões" (on), "Bloquear exportação não-admin" (off), "Integração antifraude" (disabled, badge "Em breve")

---

### 4.26 Configurações — `/infra/configuracoes`

**Propósito**: Personalizar pipelines, integrações, preferências e branding.

**Layout**: Header (Settings icon) + 4 Tabs

**Tab A — Operação**:
- Botão "+ Novo pipeline"
- Cards de pipeline: nome, SLA, etapas como badges com setas, botão "Editar etapas"
- Campos customizados: estado vazio + CTA "Criar campo"
- Templates de Cadência: estado vazio + CTA "Criar template"

**Tab B — Integrações e Canais**:
- Botão "Ver todas as integrações" → `/conexoes`
- Cards: WhatsApp (✅), Google Calendar (✅), Meta Ads (❌), E-mail (❌), CRM Externo (❌)

**Tab C — Preferências**:
- Localização: Fuso horário, Moeda, Impostos (read-only placeholders)
- Comissionamento Padrão: Closer 10%, SDR 2% (read-only)

**Tab D — Conta e Branding**:
- Nome da operação, Domínio, Logo (placeholders read-only)
- Card Equipe: link para `/comercial/equipe`

---

### 4.27 NotFound — `/*` (catch-all)

**Propósito**: Página 404.

**Layout**: Centralizado com "404", "Oops! Page not found", link "Return to Home"

---

## 5. MODELO DE DADOS

### Tabela: `strategies`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| name | text | Não | 'Nova Estratégia' | Nome da estratégia |
| nodes | jsonb | Não | '[]' | Nós do ReactFlow |
| edges | jsonb | Não | '[]' | Arestas do ReactFlow |
| user_id | uuid | Sim | None | Dono da estratégia |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: Todas as operações filtram por `auth.uid() = user_id`

---

### Tabela: `sales_users`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono (auth user) |
| name | text | Não | - | Nome do profissional |
| role | text | Não | - | SDR, CLOSER, LEADER |
| email | text | Sim | - | |
| phone | text | Sim | - | |
| status | text | Não | 'active' | active/inactive |
| monthly_goal_value | numeric | Sim | 0 | Meta mensal R$ |
| commission_type | text | Sim | 'percent' | percent/fixed/hybrid |
| commission_percent | numeric | Sim | 0 | % de comissão |
| commission_fixed_value | numeric | Sim | 0 | Valor fixo comissão |
| cost_fixed_monthly | numeric | Sim | 0 | Custo fixo mensal |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`

---

### Tabela: `lead_assignments`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| lead_id | text | Não | - | ID do lead |
| assigned_to_sales_user_id | uuid | Não | - | FK → sales_users |
| assigned_by_user_id | uuid | Não | - | Quem atribuiu |
| assignment_type | text | Não | - | SDR/CLOSER |
| active | boolean | Não | true | |
| notes | text | Sim | - | |
| assigned_at | timestamptz | Não | now() | |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`
**FK**: `assigned_to_sales_user_id → sales_users.id`

---

### Tabela: `sales_activities`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| sales_user_id | uuid | Não | - | FK → sales_users |
| lead_id | text | Não | - | ID do lead |
| activity_type | text | Não | - | CALL, WHATSAPP, FOLLOW_UP, MEETING_SCHEDULED, MEETING_DONE, PROPOSAL_SENT, DEAL_WON, DEAL_LOST, NO_SHOW |
| status | text | Não | 'planned' | planned/done/canceled |
| scheduled_at | timestamptz | Sim | - | |
| occurred_at | timestamptz | Sim | - | |
| outcome | text | Sim | - | |
| loss_reason | text | Sim | - | |
| next_step | text | Sim | - | |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`
**FK**: `sales_user_id → sales_users.id`

---

### Tabela: `deals`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| lead_id | text | Não | - | |
| amount_value | numeric | Não | 0 | Valor do deal |
| stage | text | Não | 'open' | open/won/lost |
| closer_id | uuid | Sim | - | FK → sales_users |
| sdr_id | uuid | Sim | - | FK → sales_users |
| product_id | text | Sim | - | |
| event_id | text | Sim | - | |
| won_at | timestamptz | Sim | - | |
| lost_at | timestamptz | Sim | - | |
| notes | text | Sim | - | |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`
**FK**: `closer_id → sales_users.id`, `sdr_id → sales_users.id`

---

### Tabela: `commission_records`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| deal_id | uuid | Não | - | FK → deals |
| sales_user_id | uuid | Não | - | FK → sales_users |
| commission_value | numeric | Não | 0 | Valor R$ |
| status | text | Não | 'estimated' | estimated/approved/paid |
| period_month | text | Não | - | Ex: "2024-01" |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`
**FK**: `deal_id → deals.id`, `sales_user_id → sales_users.id`

---

### Tabela: `connections`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| provider | text | Não | - | Ex: "EDUZZ" |
| status | text | Não | 'disconnected' | connected/disconnected/token_expired |
| api_key_encrypted | text | Sim | - | Chave API |
| last_sync_at | timestamptz | Sim | - | |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`

---

### Tabela: `lead_sources`

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | Não | gen_random_uuid() | PK |
| user_id | uuid | Não | - | Dono |
| name | text | Não | - | |
| type | text | Não | - | EXTERNAL_PRODUCT, etc. |
| provider | text | Sim | - | Ex: "EDUZZ" |
| reference_id | text | Sim | - | ID do produto externo |
| reference_name | text | Sim | - | Nome do produto |
| cached_count | integer | Sim | 0 | Contagem de compradores |
| connection_id | uuid | Sim | - | FK → connections |
| last_sync_at | timestamptz | Sim | - | |
| created_at | timestamptz | Não | now() | |
| updated_at | timestamptz | Não | now() | |

**RLS**: `auth.uid() = user_id`
**FK**: `connection_id → connections.id`

---

### Função de Banco: `update_updated_at_column()`

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
```

> Nota: Não há triggers configurados no banco atualmente.

---

## 6. COMPONENTES COMPARTILHADOS

### MetricCard

**Localização**: `src/components/MetricCard.tsx`

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| title | string | Sim | Título da métrica |
| value | string \| number | Sim | Valor exibido |
| icon | LucideIcon | Sim | Ícone |
| trend | `{value: number, isPositive: boolean}` | Não | Tendência vs mês anterior |
| subtitle | string | Não | Subtítulo |
| variant | 'default' \| 'success' \| 'warning' \| 'accent' | Não | Estilo visual |

**Comportamento**: Card com border-2, gradiente sutil, ícone no canto, hover com sombra. Tendência em verde (positiva) ou vermelho (negativa).

**Usado em**: Dashboard, Pipeline, LeadDetail, EventosList, EventoDetail, Campanhas, PerformanceComercial, PainelProdutor

---

### GlobalContextSelector

**Localização**: `src/components/GlobalContextSelector.tsx`

**Props**: Nenhuma (usa `useGlobalFilters()`)

**Comportamento**: Barra de filtros globais com 5 selects (Período, Evento, Pipeline, Time, Origem). Exibe chips de filtros ativos com botão X para remover. Botão "Limpar" quando há filtros ativos.

**Usado em**: Dashboard, Pipeline, LeadsList, LeadDetail

---

### NavLink

**Localização**: `src/components/NavLink.tsx`

| Prop | Tipo | Obrigatório |
|------|------|-------------|
| to | string | Sim |
| className | string | Não |
| activeClassName | string | Não |
| pendingClassName | string | Não |

**Comportamento**: Wrapper do React Router `NavLink` que aceita `className` como string + `activeClassName` separado.

**Usado em**: AppSidebar

---

### AppSidebar

**Localização**: `src/components/AppSidebar.tsx`

**Props**: Nenhuma

**Comportamento**: Sidebar com logo, menu hierárquico colapsável (7 seções), email do usuário, botão sair. Suporta estado expandido/colapsado.

---

### LeadComercialTab

**Localização**: `src/components/crm/LeadComercialTab.tsx`

| Prop | Tipo | Obrigatório |
|------|------|-------------|
| leadId | string | Sim |

**Comportamento**: Tab Comercial na ficha do lead. Exibe status comercial automático, SDR/Closer atribuídos, botões de ação (atribuir, registrar atividade, fechar venda) com modais, timeline de atividades, deals. Calcula comissões automaticamente ao fechar venda.

---

### LeadSourceSelector

**Localização**: `src/components/crm/LeadSourceSelector.tsx`

**Props**: Nenhuma

**Comportamento**: Radio toggle CRM/Produtos. Quando "Produtos": mostra plataformas conectadas, seleciona produto, exibe contagem de compradores, cria `lead_source`. Lista bases já criadas.

---

### ElementPanel (Estratégias)

**Localização**: `src/components/estrategias/ElementPanel.tsx`

| Prop | Tipo | Obrigatório |
|------|------|-------------|
| onAddNode | `(element: ElementType) => void` | Sim |

**Comportamento**: Painel retrátil com 9 tipos de elementos para o construtor de estratégias. Modo colapsado mostra apenas ícones.

---

### StrategyNode

**Localização**: `src/components/estrategias/StrategyNode.tsx`

**Comportamento**: Nó customizado do ReactFlow. Exibe ícone colorido, label, badge de tipo, métricas (leads + conversão). Duplo-clique para editar inline (nome + leads). Handles de conexão esquerda/direita.

---

## 7. HOOKS E CONTEXTOS

### useAuth

**Localização**: `src/hooks/useAuth.tsx`

**Retorna**: `{ user, session, loading, signIn, signUp, signOut }`

**Dependências**: Supabase Auth

**Usado em**: Toda a aplicação (via AuthProvider)

---

### useGlobalFilters

**Localização**: `src/contexts/GlobalFilterContext.tsx`

**Retorna**: `{ filters, setFilter, clearFilters, activeFilterCount }`

**Interface de filtros**:
```typescript
{
  period: string;     // "today" | "7d" | "30d" | "month" | "custom"
  event: string;      // "all" | "imersao-ht" | "workshop-6fig" | "blanket"
  pipeline: string;   // "all" | "mentoria" | "evento" | "mastermind"
  team: string;       // "all" | "sdrs" | "closers" | nome individual
  origin: string;     // "all" | "meta-ads" | "instagram" | "indicacao" | "evento" | "low-ticket"
}
```

**Usado em**: Dashboard, Pipeline, LeadsList, LeadDetail (via GlobalContextSelector)

---

### useStrategies

**Localização**: `src/hooks/useStrategies.ts`

**Retorna**: `{ strategies, isLoading, createStrategy, updateStrategy, deleteStrategy }`

**Dependências**: React Query, Supabase (`strategies` table)

**Usado em**: ConstrutorEstrategias

---

### useEdgeConversion

**Localização**: `src/components/estrategias/useEdgeConversion.ts`

**Retorna**: `{ updateConversions }` — função que calcula taxas de conversão entre nós conectados

**Exporta também**: `computeEdgesWithConversion(nodes, edges)` — função pura

**Usado em**: ConstrutorEstrategias

---

## 8. DADOS MOCK SUGERIDOS

### Dashboard

```json
{
  "todayActions": [
    {"id": 1, "type": "Follow-up", "lead": "Maria Santos", "time": "10:00", "overdue": true},
    {"id": 2, "type": "Call agendada", "lead": "Pedro Costa", "time": "14:30", "overdue": false},
    {"id": 3, "type": "Enviar proposta", "lead": "Roberto Almeida", "time": "16:00", "overdue": false}
  ],
  "hotLeadsAging": [
    {"id": 1, "name": "Lucia Ferreira", "stage": "Follow-up", "days": 5, "value": 20000},
    {"id": 2, "name": "Ana Oliveira", "stage": "Lead Frio", "days": 8, "value": 10000},
    {"id": 3, "name": "Carlos Mendes", "stage": "Call Agendada", "days": 3, "value": 35000},
    {"id": 4, "name": "João Silva", "stage": "Engajado", "days": 4, "value": 15000},
    {"id": 5, "name": "Fernanda Lima", "stage": "Warm", "days": 6, "value": 25000}
  ],
  "funnelData": [
    {"stage": "Lead Frio", "count": 1200, "conversion": 100},
    {"stage": "Engajado", "count": 840, "conversion": 70},
    {"stage": "Warm", "count": 504, "conversion": 42},
    {"stage": "Call Agendada", "count": 252, "conversion": 21},
    {"stage": "Fechou", "count": 76, "conversion": 6.3}
  ],
  "revenueData": [
    {"month": "Jan", "revenue": 145000, "leads": 45},
    {"month": "Fev", "revenue": 198000, "leads": 62},
    {"month": "Mar", "revenue": 234000, "leads": 71},
    {"month": "Abr", "revenue": 267000, "leads": 85},
    {"month": "Mai", "revenue": 312000, "leads": 98},
    {"month": "Jun", "revenue": 389000, "leads": 112}
  ],
  "sourceData": [
    {"name": "Instagram", "value": 42},
    {"name": "Facebook", "value": 28},
    {"name": "LinkedIn", "value": 18},
    {"name": "Indicação", "value": 12}
  ],
  "paymentsAtRisk": [
    {"id": 1, "lead": "Carlos Mendes", "type": "PIX expirando", "value": 35000, "deadline": "Hoje"},
    {"id": 2, "lead": "Fernanda Lima", "type": "Cartão recusado", "value": 25000, "deadline": "Ontem"}
  ]
}
```

### CRM Pipeline

```json
{
  "pipelineStages": [
    {"id": "lead-frio", "title": "Lead Frio", "color": "bg-slate-500"},
    {"id": "engajado", "title": "Engajado", "color": "bg-blue-500"},
    {"id": "warm", "title": "Warm", "color": "bg-yellow-500"},
    {"id": "agendou", "title": "Agendou", "color": "bg-orange-500"},
    {"id": "call-agendada", "title": "Call Agendada", "color": "bg-purple-500"},
    {"id": "call-realizada", "title": "Call Realizada", "color": "bg-indigo-500"},
    {"id": "follow-up", "title": "Follow-up", "color": "bg-pink-500"},
    {"id": "fechou", "title": "Fechou", "color": "bg-green-500"},
    {"id": "onboarding", "title": "Onboarding", "color": "bg-emerald-500"}
  ],
  "leads": [
    {"id": 1, "name": "João Silva", "stage": "engajado", "score": 85, "iem": 78, "value": 15000, "origin": "Meta Ads", "lastContact": "2h", "pitch": "Mentoria Elite", "responsible": "Ana Ribeiro"},
    {"id": 2, "name": "Maria Santos", "stage": "warm", "score": 92, "iem": 85, "value": 25000, "origin": "Evento", "lastContact": "1d", "pitch": "Mastermind", "responsible": "Rafael Costa"},
    {"id": 3, "name": "Pedro Costa", "stage": "call-agendada", "score": 78, "iem": 72, "value": 12000, "origin": "Indicação", "lastContact": "30m", "pitch": "Curso Premium", "responsible": "Lucas Martins"},
    {"id": 4, "name": "Ana Oliveira", "stage": "lead-frio", "score": 45, "iem": 0, "value": 10000, "origin": "Low Ticket", "lastContact": "3d", "pitch": null, "responsible": "Ana Ribeiro"},
    {"id": 5, "name": "Carlos Mendes", "stage": "fechou", "score": 98, "iem": 92, "value": 35000, "origin": "Evento", "lastContact": "1h", "pitch": "Mentoria VIP", "responsible": "Mariana Lopes"},
    {"id": 6, "name": "Lucia Ferreira", "stage": "follow-up", "score": 88, "iem": 80, "value": 20000, "origin": "Meta Ads", "lastContact": "4h", "pitch": "Mentoria Elite", "responsible": "Rafael Costa"}
  ]
}
```

### Ficha do Lead

```json
{
  "lead": {
    "id": 1, "name": "João Silva", "email": "joao.silva@email.com",
    "phone": "+55 11 99999-9999", "stage": "Engajado", "score": 85, "iem": 78,
    "origin": "Meta Ads", "cac": 150, "ltv": 15000, "cacLtv": 100, "roas": 10,
    "createdAt": "15/01/2024", "lastInteraction": "2h atrás", "pitch": "Mentoria Elite"
  },
  "events": [
    {"id": 1, "name": "Imersão High-Ticket", "date": "20/01/2024", "status": "Confirmado"},
    {"id": 2, "name": "Workshop Vendas", "date": "25/01/2024", "status": "Pendente"}
  ],
  "purchases": [
    {"id": 1, "product": "Ebook Vendas", "value": 97, "date": "10/01/2024", "status": "Pago"},
    {"id": 2, "product": "Mini-curso", "value": 297, "date": "12/01/2024", "status": "Pago"}
  ],
  "courses": [
    {"id": 1, "name": "Fundamentos de Vendas", "progress": 75},
    {"id": 2, "name": "Copywriting Avançado", "progress": 30}
  ],
  "mentorships": [
    {"id": 1, "name": "Mentoria Elite 2024", "iem": 78, "nextSession": "28/01/2024"}
  ],
  "timeline": [
    {"id": 1, "action": "Comprou Ebook", "date": "10/01/2024 14:30", "type": "purchase"},
    {"id": 2, "action": "Inscrito no evento", "date": "15/01/2024 10:00", "type": "event"},
    {"id": 3, "action": "Abriu email campanha", "date": "16/01/2024 09:15", "type": "email"},
    {"id": 4, "action": "Respondeu pesquisa Blinket", "date": "18/01/2024 16:45", "type": "engagement"},
    {"id": 5, "action": "Call agendada", "date": "19/01/2024 11:00", "type": "call"}
  ],
  "aiSuggestions": {
    "nextAction": "Enviar lembrete do evento via WhatsApp",
    "bestPitch": "Mentoria Elite - maior fit com perfil",
    "bestChannel": "WhatsApp (taxa de resposta: 85%)"
  }
}
```

### Eventos

```json
{
  "events": [
    {"id": 1, "name": "Imersão High-Ticket 2024", "date": "20/01/2024", "time": "09:00 - 18:00", "registrations": 245, "checkins": 198, "revenue": 125000, "pitches": 3, "status": "Ativo"},
    {"id": 2, "name": "Workshop Vendas Consultivas", "date": "25/01/2024", "time": "14:00 - 17:00", "registrations": 180, "checkins": 0, "revenue": 54000, "pitches": 2, "status": "Agendado"},
    {"id": 3, "name": "Masterclass Copywriting", "date": "15/01/2024", "time": "19:00 - 21:00", "registrations": 320, "checkins": 298, "revenue": 89000, "pitches": 1, "status": "Concluído"},
    {"id": 4, "name": "Mentoria Coletiva VIP", "date": "28/01/2024", "time": "10:00 - 12:00", "registrations": 50, "checkins": 0, "revenue": 75000, "pitches": 1, "status": "Agendado"}
  ]
}
```

### Campanhas

```json
{
  "campaigns": [
    {"id": 1, "name": "Lançamento Mentoria Elite", "channel": "WhatsApp", "status": "Ativa", "sent": 1250, "opened": 980, "clicked": 450, "converted": 35, "revenue": 420000},
    {"id": 2, "name": "Follow-up Evento", "channel": "Email", "status": "Ativa", "sent": 890, "opened": 520, "clicked": 180, "converted": 12, "revenue": 144000},
    {"id": 3, "name": "Carrinho Abandonado", "channel": "WhatsApp", "status": "Pausada", "sent": 320, "opened": 290, "clicked": 120, "converted": 28, "revenue": 84000},
    {"id": 4, "name": "Upsell Mastermind", "channel": "SMS", "status": "Rascunho", "sent": 0, "opened": 0, "clicked": 0, "converted": 0, "revenue": 0}
  ]
}
```

### Automações

```json
{
  "automations": [
    {"id": 1, "name": "Boas-vindas Evento", "trigger": "Inscrição em evento", "enabled": true, "executions": 1250, "conversions": 89, "channels": ["WhatsApp", "Email"]},
    {"id": 2, "name": "Lead Engajado", "trigger": "Mudança no CRM para Engajado", "enabled": true, "executions": 890, "conversions": 45, "channels": ["WhatsApp"]},
    {"id": 3, "name": "Carrinho Abandonado SUN", "trigger": "Abandono do Checkout SUN", "enabled": true, "executions": 320, "conversions": 28, "channels": ["WhatsApp", "SMS"]},
    {"id": 4, "name": "Follow-up Pitch", "trigger": "Interesse em pitch", "enabled": true, "executions": 560, "conversions": 38, "channels": ["WhatsApp"]},
    {"id": 5, "name": "Onboarding Mentoria", "trigger": "Entrada em mentoria", "enabled": true, "executions": 145, "conversions": 145, "channels": ["WhatsApp", "Email"]},
    {"id": 6, "name": "Reengajamento IEM", "trigger": "Baixa no IEM (< 50%)", "enabled": false, "executions": 78, "conversions": 12, "channels": ["WhatsApp"]}
  ]
}
```

### Cursos (Visão Aluno)

```json
{
  "courses": [
    {"id": 1, "name": "Fundamentos de Vendas High-Ticket", "platform": "Nutror", "progress": 75, "totalModules": 12, "completedModules": 9, "lastAccess": "Hoje, 14:30", "duration": "24h", "certificate": false},
    {"id": 2, "name": "Copywriting para Conversão", "platform": "Alpaclass", "progress": 100, "totalModules": 8, "completedModules": 8, "lastAccess": "Ontem, 10:00", "duration": "16h", "certificate": true},
    {"id": 3, "name": "Estratégias de Lançamento", "platform": "Nutror", "progress": 30, "totalModules": 10, "completedModules": 3, "lastAccess": "3 dias atrás", "duration": "20h", "certificate": false},
    {"id": 4, "name": "Mindset do Empreendedor", "platform": "Alpaclass", "progress": 0, "totalModules": 6, "completedModules": 0, "lastAccess": "Nunca acessado", "duration": "12h", "certificate": false}
  ]
}
```

### Mentoria (Visão Aluno)

```json
{
  "mentorship": {
    "name": "Mentoria Elite 2024",
    "mentor": {"name": "Carlos Ferreira", "role": "Mentor Principal"},
    "iem": 78,
    "nextSession": {"date": "28/01/2024", "time": "14:00", "topic": "Estratégias de Fechamento"},
    "schedule": [
      {"date": "14/01/2024", "topic": "Introdução e Alinhamento", "status": "Concluído"},
      {"date": "21/01/2024", "topic": "Posicionamento de Mercado", "status": "Concluído"},
      {"date": "28/01/2024", "topic": "Estratégias de Fechamento", "status": "Próximo"},
      {"date": "04/02/2024", "topic": "Construção de Ofertas", "status": "Agendado"}
    ],
    "tasks": [
      {"title": "Definir persona ideal", "deadline": "20/01/2024", "status": "Entregue", "score": 95},
      {"title": "Criar script de vendas", "deadline": "27/01/2024", "status": "Pendente", "score": null}
    ],
    "materials": [
      {"name": "Planilha de Metas", "type": "Excel", "size": "245 KB"},
      {"name": "E-book Vendas High-Ticket", "type": "PDF", "size": "3.2 MB"}
    ],
    "recordings": [
      {"title": "Sessão 1 - Introdução", "date": "14/01/2024", "duration": "1h 32min"},
      {"title": "Sessão 2 - Posicionamento", "date": "21/01/2024", "duration": "1h 45min"}
    ],
    "iemHistory": [
      {"week": "Sem 1", "value": 65},
      {"week": "Sem 2", "value": 72},
      {"week": "Sem 3", "value": 78}
    ]
  }
}
```

### Painel do Mentor

```json
{
  "classes": [
    {"id": 1, "name": "Turma Elite 2024", "students": 25, "avgIem": 78, "nextSession": "28/01/2024"},
    {"id": 2, "name": "Mastermind VIP", "students": 12, "avgIem": 85, "nextSession": "30/01/2024"}
  ],
  "students": [
    {"id": 1, "name": "João Silva", "iem": 78, "attendance": 100, "tasksDelivered": 3, "totalTasks": 4},
    {"id": 2, "name": "Maria Santos", "iem": 92, "attendance": 100, "tasksDelivered": 4, "totalTasks": 4},
    {"id": 3, "name": "Pedro Costa", "iem": 65, "attendance": 80, "tasksDelivered": 2, "totalTasks": 4},
    {"id": 4, "name": "Ana Oliveira", "iem": 88, "attendance": 100, "tasksDelivered": 4, "totalTasks": 4},
    {"id": 5, "name": "Carlos Mendes", "iem": 45, "attendance": 60, "tasksDelivered": 1, "totalTasks": 4}
  ]
}
```

### Painel do Produtor

```json
{
  "overview": {
    "activeMentorships": 3, "totalMentees": 62, "avgIem": 76,
    "totalRevenue": 744000, "activeCourses": 5, "totalStudents": 1250
  },
  "mentorships": [
    {"name": "Mentoria Elite 2024", "mentor": "Carlos Ferreira", "mentees": 25, "avgIem": 78, "revenue": 300000},
    {"name": "Mastermind VIP", "mentor": "Ana Paula", "mentees": 12, "avgIem": 85, "revenue": 300000},
    {"name": "Grupo Iniciantes", "mentor": "Roberto Lima", "mentees": 25, "avgIem": 65, "revenue": 144000}
  ],
  "iemDistribution": [
    {"range": "90-100%", "count": 8},
    {"range": "70-89%", "count": 28},
    {"range": "50-69%", "count": 18},
    {"range": "< 50%", "count": 8}
  ]
}
```

### Segurança

```json
{
  "users": [
    {"name": "Lucas Martins", "email": "lucas@empresa.com", "role": "Admin", "modules": ["CRM", "Comercial", "Monetização", "Relatórios"], "scope": "Todos"},
    {"name": "Ana Ribeiro", "email": "ana@empresa.com", "role": "SDR", "modules": ["CRM", "Comercial"], "scope": "Evento: Blanket"},
    {"name": "Rafael Costa", "email": "rafael@empresa.com", "role": "Closer", "modules": ["CRM", "Comercial", "Monetização"], "scope": "Todos"},
    {"name": "Mariana Lopes", "email": "mariana@empresa.com", "role": "Gestor", "modules": ["CRM", "Comercial", "Relatórios", "Experiência"], "scope": "Todos"}
  ],
  "audit": [
    {"date": "17/02/2026 14:32", "user": "Lucas Martins", "action": "Alterou comissão", "entity": "Rafael Costa — 10% → 12%"},
    {"date": "17/02/2026 11:05", "user": "Ana Ribeiro", "action": "Exportou leads", "entity": "Lista de Leads (142 registros)"},
    {"date": "16/02/2026 19:48", "user": "Rafael Costa", "action": "Moveu lead", "entity": "João Silva → Proposta Enviada"},
    {"date": "16/02/2026 09:12", "user": "Mariana Lopes", "action": "Criou automação", "entity": "Follow-up 48h sem resposta"}
  ],
  "alerts": [
    {"title": "Taxa de chargeback elevada", "description": "3 chargebacks nos últimos 7 dias (acima do limite de 1%)", "severity": "error"},
    {"title": "Tentativas de pagamento falhando", "description": "12 tentativas de cartão recusadas hoje", "severity": "warn"},
    {"title": "Login de localização incomum", "description": "Lucas Martins acessou de IP desconhecido às 03:22", "severity": "warn"}
  ]
}
```

---

## 9. FLUXOS CRÍTICOS PASSO A PASSO

### Fluxo 1: Cadastro e Qualificação de um Lead

1. Usuário acessa `/crm/leads` → clica "+ Novo Lead" (placeholder, não implementado com Supabase ainda)
2. Lead aparece na lista com dados mock
3. Clica no olho → abre `/crm/lead/:id`
4. Na tab "Comercial", clica "Atribuir SDR" → modal com select de profissional → confirma
5. SDR faz atividades: clica "Registrar Atividade" → tipo (Ligação/WhatsApp/etc), profissional, resultado
6. Lead avança pelo pipeline (visual): estágios Lead Frio → Engajado → Warm → Call Agendada → Call Realizada → Follow-up → Fechou
7. Closer fecha: clica "Fechar Venda" → valor, closer, resultado (Ganho/Perdido)
8. Comissão é calculada automaticamente e inserida em `commission_records`

### Fluxo 2: Criação e Gestão de um Evento

1. Acessa `/eventos` → lista de eventos mock
2. Clica em evento → `/eventos/detalhe/:id`
3. Visualiza métricas: inscritos, check-ins, receita
4. Tab "Pitches": vê pitches configurados, clica para editar → `/eventos/pitch/:id`
5. Tab "Participantes": lista com check-in status
6. Tab "Engajamento Pré": pesquisas e enquetes Blinket
7. Tab "Engajamento Durante": perguntas ao vivo, reações, QR scans
8. Tab "Métricas": conversão por pitch, CAC, LTV, ROAS

### Fluxo 3: Criação e Envio de Campanha de Comunicação

1. Acessa `/comunicacao/campanhas` → lista de campanhas
2. Clica "+ Nova Campanha" (placeholder)
3. Vai para `/comunicacao/editor`
4. Configura nome + canal (WhatsApp/Email/SMS)
5. Escreve mensagem usando placeholders (`{{nome}}`, `{{evento}}`, etc.)
6. Opcionalmente usa sugestão da IA
7. Pré-visualiza com dados substituídos
8. Clica "Enviar Campanha" (placeholder)

### Fluxo 4: Registro de Atividade Comercial

1. Acessa `/crm/lead/:id` → tab "Comercial"
2. Clica "Registrar Atividade"
3. Modal: seleciona tipo (Ligação, WhatsApp, Follow-up, Reunião Agendada, etc.)
4. Seleciona profissional responsável
5. Opcionalmente agenda para data futura (scheduled_at)
6. Adiciona resultado/observações
7. Clica "Registrar" → INSERT em `sales_activities`
8. Atividade aparece na timeline com ícone e dados
9. Status comercial do lead é recalculado automaticamente

### Fluxo 5: Acesso a uma Mentoria

**Visão Mentorado** (`/entrega/mentorias`):
1. Vê card da mentoria com nome, mentor, IEM atual (78%)
2. Card destacado da próxima sessão com botão "Entrar na Sessão"
3. Tab "Cronograma": lista de sessões com status
4. Tab "Tarefas": entrega tarefas pendentes, vê notas recebidas
5. Tab "Materiais": baixa PDFs/planilhas
6. Tab "Gravações": assiste sessões passadas
7. Tab "Meu IEM": acompanha evolução semanal

**Visão Mentor** (`/entrega/mentor`):
1. Seleciona turma (card com IEM médio)
2. Tab "Mentorados": lista com IEM individual (verde/amarelo/vermelho)
3. Tab "Presença": registra presença das sessões
4. Tab "Tarefas": avalia entregas pendentes
5. Tab "Materiais": sobe materiais para turma

---

## DEPENDÊNCIAS DO PROJETO

| Pacote | Versão | Uso |
|--------|--------|-----|
| react | ^18.3.1 | Framework UI |
| react-dom | ^18.3.1 | Renderização |
| react-router-dom | ^6.30.1 | Roteamento |
| @tanstack/react-query | ^5.83.0 | Gerenciamento de estado servidor |
| @supabase/supabase-js | ^2.91.1 | Backend (auth, DB) |
| @xyflow/react | ^12.10.0 | Flow builder (Construtor de Estratégias) |
| recharts | ^2.15.4 | Gráficos (BarChart, LineChart, PieChart) |
| lucide-react | ^0.462.0 | Ícones |
| tailwindcss-animate | ^1.0.7 | Animações CSS |
| class-variance-authority | ^0.7.1 | Variantes de componentes |
| clsx | ^2.1.0 | Merge de classes |
| tailwind-merge | ^2.6.0 | Merge inteligente de Tailwind |
| zod | ^3.25.76 | Validação de schemas |
| react-hook-form | ^7.61.1 | Formulários |
| @hookform/resolvers | ^3.10.0 | Resolvers Zod para react-hook-form |
| date-fns | ^3.6.0 | Manipulação de datas |
| sonner | ^1.7.4 | Toast notifications |
| cmdk | ^1.1.1 | Command menu |
| vaul | ^0.9.9 | Drawer |
| embla-carousel-react | ^8.6.0 | Carousel |
| input-otp | ^1.4.2 | Input OTP |
| react-day-picker | ^8.10.1 | Date picker |
| react-resizable-panels | ^2.1.9 | Painéis redimensionáveis |
| next-themes | ^0.3.0 | Dark mode |

**Build**: Vite + TypeScript

---

> Este documento é o blueprint completo do produto HighFlow. Ele contém todas as informações necessárias para reconstruir fielmente o protótipo em um ambiente separado.
