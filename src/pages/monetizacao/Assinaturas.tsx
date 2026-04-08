import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Users, UserPlus, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const mrrChartData = [
  { month: 'Out/25', mrr: 2970,  assinantes: 10  },
  { month: 'Nov/25', mrr: 5940,  assinantes: 20  },
  { month: 'Dez/25', mrr: 10890, assinantes: 37  },
  { month: 'Jan/26', mrr: 16830, assinantes: 57  },
  { month: 'Fev/26', mrr: 23760, assinantes: 80  },
  { month: 'Mar/26', mrr: 29700, assinantes: 100 },
];

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

export default function Assinaturas() {
  const mrr = useCountUp(29700);
  const ativos = useCountUp(100, 1000);
  const novos = useCountUp(14, 800);

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
    </div>
  );
}
