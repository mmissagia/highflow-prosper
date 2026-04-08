import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Users, UserPlus, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ── MRR Chart Data ──
const mrrChartData = [
  { month: 'Out/25', mrr: 2970,  assinantes: 10  },
  { month: 'Nov/25', mrr: 5940,  assinantes: 20  },
  { month: 'Dez/25', mrr: 10890, assinantes: 37  },
  { month: 'Jan/26', mrr: 16830, assinantes: 57  },
  { month: 'Fev/26', mrr: 23760, assinantes: 80  },
  { month: 'Mar/26', mrr: 29700, assinantes: 100 },
];

// ── Subscribers Mock Data ──
type SubscriptionStatus = 'ativa' | 'em_risco' | 'pausada' | 'cancelada';

interface Subscriber {
  id: string;
  lead: string;
  leadId: string;
  produto: string;
  valor: number;
  inicio: Date;
  proximaCobranca: Date;
  status: SubscriptionStatus;
}

const mockSubscribers: Subscriber[] = [
  { id: 'sub-001', lead: 'Rafael Mendonça',  leadId: 'lead-1', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2025-10-15'), proximaCobranca: new Date(Date.now() + 8  * 86400000), status: 'ativa'     },
  { id: 'sub-002', lead: 'Fernanda Alves',   leadId: 'lead-2', produto: 'Suporte Contínuo',  valor: 197, inicio: new Date('2025-11-03'), proximaCobranca: new Date(Date.now() + 3  * 86400000), status: 'em_risco'  },
  { id: 'sub-003', lead: 'Bruno Figueiredo', leadId: 'lead-5', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2025-10-20'), proximaCobranca: new Date(Date.now() + 15 * 86400000), status: 'ativa'     },
  { id: 'sub-004', lead: 'Juliana Martins',  leadId: 'lead-4', produto: 'Grupo VIP',          valor: 497, inicio: new Date('2025-12-01'), proximaCobranca: new Date(Date.now() + 22 * 86400000), status: 'ativa'     },
  { id: 'sub-005', lead: 'Thiago Correia',   leadId: 'lead-3', produto: 'Suporte Contínuo',  valor: 197, inicio: new Date('2026-01-10'), proximaCobranca: new Date(Date.now() + 1  * 86400000), status: 'em_risco'  },
  { id: 'sub-006', lead: 'Marcos Pinheiro',  leadId: 'lead-1', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2026-02-05'), proximaCobranca: new Date(Date.now() + 18 * 86400000), status: 'ativa'     },
  { id: 'sub-007', lead: 'Camila Rodrigues', leadId: 'lead-2', produto: 'Grupo VIP',          valor: 497, inicio: new Date('2025-11-15'), proximaCobranca: new Date(Date.now() + 5  * 86400000), status: 'pausada'   },
  { id: 'sub-008', lead: 'Eduardo Lima',     leadId: 'lead-3', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2026-01-20'), proximaCobranca: new Date(Date.now() + 25 * 86400000), status: 'ativa'     },
  { id: 'sub-009', lead: 'Patricia Souza',   leadId: 'lead-4', produto: 'Suporte Contínuo',  valor: 197, inicio: new Date('2025-12-10'), proximaCobranca: new Date(Date.now() - 2  * 86400000), status: 'em_risco'  },
  { id: 'sub-010', lead: 'Roberto Gomes',    leadId: 'lead-5', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2026-02-18'), proximaCobranca: new Date(Date.now() + 30 * 86400000), status: 'ativa'     },
  { id: 'sub-011', lead: 'Luciana Castro',   leadId: 'lead-1', produto: 'Grupo VIP',          valor: 497, inicio: new Date('2026-03-01'), proximaCobranca: new Date(Date.now() + 12 * 86400000), status: 'ativa'     },
  { id: 'sub-012', lead: 'Diego Ferreira',   leadId: 'lead-2', produto: 'Comunidade Elite',  valor: 297, inicio: new Date('2025-10-05'), proximaCobranca: new Date(Date.now() - 5  * 86400000), status: 'cancelada' },
];

const statusConfig: Record<SubscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ativa:     { label: 'Ativa',      variant: 'default'     },
  em_risco:  { label: 'Em Risco',   variant: 'destructive' },
  pausada:   { label: 'Pausada',    variant: 'secondary'   },
  cancelada: { label: 'Cancelada',  variant: 'outline'     },
};

// ── Hooks ──
function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ── Metric Cards Config ──
const metricCards = [
  {
    title: 'MRR Atual',
    target: 29700,
    format: 'currency',
    trend: '↑ 24,9% vs. mês anterior',
    trendPositive: true,
    icon: TrendingUp,
    iconClass: 'text-primary bg-primary/10',
  },
  {
    title: 'Assinantes Ativos',
    target: 100,
    format: 'number',
    trend: '↑ 25% vs. mês anterior',
    trendPositive: true,
    icon: Users,
    iconClass: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  },
  {
    title: 'Novos este mês',
    target: 14,
    format: 'number',
    trend: '↑ 16,7% vs. mês anterior',
    trendPositive: true,
    icon: UserPlus,
    iconClass: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: 'Churn Rate',
    target: 2.1,
    format: 'percent',
    trend: '↓ 0,3pp vs. mês anterior',
    trendPositive: false,
    icon: TrendingDown,
    iconClass: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    isChurn: true,
  },
];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const formatCurrencyFull = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      <p className="text-sm text-primary font-semibold">
        MRR: {formatCurrency(payload[0]?.value ?? 0)}
      </p>
      <p className="text-xs text-muted-foreground">
        {payload[1]?.value ?? 0} assinantes
      </p>
    </div>
  );
}

// ── Subscriber Row ──
function SubscriberRow({
  sub,
  onVerLead,
  onPausar,
  onCancelar,
}: {
  sub: Subscriber;
  onVerLead: (leadId: string) => void;
  onPausar: (nome: string) => void;
  onCancelar: (nome: string) => void;
}) {
  const config = statusConfig[sub.status];
  const isAtRisk = sub.status === 'em_risco';

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg border gap-4',
      isAtRisk
        ? 'border-destructive/30 bg-destructive/5'
        : 'border-border bg-card',
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{sub.lead}</p>
          <Badge variant={config.variant} className="text-[10px] py-0">{config.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{sub.produto}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">
          {formatCurrencyFull(sub.valor)}/mês
        </p>
        <p className="text-xs text-muted-foreground">
          Próx: {format(sub.proximaCobranca, "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button size="sm" variant="ghost" className="text-xs h-7 px-2"
          onClick={() => onVerLead(sub.leadId)}>Ver Lead</Button>
        <Button size="sm" variant="ghost" className="text-xs h-7 px-2"
          onClick={() => onPausar(sub.lead)}>Pausar</Button>
        <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-destructive hover:text-destructive"
          onClick={() => onCancelar(sub.lead)}>Cancelar</Button>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function Assinaturas() {
  const navigate = useNavigate();
  const mrr = useCountUp(29700);
  const ativos = useCountUp(100, 1000);
  const novos = useCountUp(14, 800);

  const emRisco = mockSubscribers.filter(s => s.status === 'em_risco');

  const handleVerLead = (leadId: string) => navigate(`/crm/leads/${leadId}`);
  const handlePausar = (nome: string) => toast.info(`Pausar assinatura de ${nome} estará disponível após integração com Z2Pay.`);
  const handleCancelar = (nome: string) => toast.info(`Cancelar assinatura de ${nome} estará disponível após integração com Z2Pay.`);

  const displayValues: Record<string, string> = {
    'MRR Atual': formatCurrency(mrr),
    'Assinantes Ativos': String(ativos),
    'Novos este mês': String(novos),
    'Churn Rate': '2,1%',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua base de receita recorrente.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <Card key={m.title} className="border transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{m.title}</p>
                  <p className="text-2xl font-bold text-foreground">{displayValues[m.title]}</p>
                  <p className={cn(
                    'text-xs mt-1.5',
                    m.trendPositive ? 'text-green-600' : 'text-red-600',
                  )}>
                    {m.trend}
                  </p>
                </div>
                <div className={cn('p-2.5 rounded-lg shrink-0', m.iconClass)}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MRR Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do MRR</CardTitle>
          <CardDescription>Crescimento da receita recorrente nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis yAxisId="mrr" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} className="text-xs" />
                <YAxis yAxisId="assinantes" orientation="right" className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="mrr"
                  type="monotone"
                  dataKey="mrr"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="assinantes"
                  type="monotone"
                  dataKey="assinantes"
                  stroke="hsl(var(--accent))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Linha sólida: MRR (R$) • Linha tracejada: Assinantes ativos
          </p>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Assinantes</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Cobrança via Z2Pay — em breve
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas">
            <TabsList className="mb-4">
              <TabsTrigger value="todas">Todas ({mockSubscribers.length})</TabsTrigger>
              <TabsTrigger value="em_risco" className="data-[state=active]:text-destructive">
                Em Risco ({emRisco.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="todas">
              <div className="space-y-2">
                {mockSubscribers.map(sub => (
                  <SubscriberRow key={sub.id} sub={sub} onVerLead={handleVerLead} onPausar={handlePausar} onCancelar={handleCancelar} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="em_risco">
              <div className="space-y-2">
                {emRisco.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium">Nenhum assinante em risco</p>
                    <p className="text-xs text-muted-foreground mt-1">Todas as cobranças estão em dia.</p>
                  </div>
                ) : (
                  emRisco.map(sub => (
                    <SubscriberRow key={sub.id} sub={sub} onVerLead={handleVerLead} onPausar={handlePausar} onCancelar={handleCancelar} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
