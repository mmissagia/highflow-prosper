import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Phone,
  Zap,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// --- Mock data ---
const todayActions = [
  { id: 1, type: "Follow-up", lead: "Maria Santos", time: "10:00", overdue: true },
  { id: 2, type: "Call agendada", lead: "Pedro Costa", time: "14:30", overdue: false },
  { id: 3, type: "Enviar proposta", lead: "Roberto Almeida", time: "16:00", overdue: false },
];

const hotLeadsAging = [
  { id: 1, name: "Lucia Ferreira", stage: "Follow-up", days: 5, value: 20000 },
  { id: 2, name: "Ana Oliveira", stage: "Lead Frio", days: 8, value: 10000 },
  { id: 3, name: "Carlos Mendes", stage: "Call Agendada", days: 3, value: 35000 },
  { id: 4, name: "João Silva", stage: "Engajado", days: 4, value: 15000 },
  { id: 5, name: "Fernanda Lima", stage: "Warm", days: 6, value: 25000 },
];

const funnelData = [
  { stage: "Lead Frio", count: 1200, conversion: 100 },
  { stage: "Engajado", count: 840, conversion: 70 },
  { stage: "Warm", count: 504, conversion: 42 },
  { stage: "Call Agendada", count: 252, conversion: 21 },
  { stage: "Fechou", count: 76, conversion: 6.3 },
];

const revenueData = [
  { month: "Jan", revenue: 145000, leads: 45 },
  { month: "Fev", revenue: 198000, leads: 62 },
  { month: "Mar", revenue: 234000, leads: 71 },
  { month: "Abr", revenue: 267000, leads: 85 },
  { month: "Mai", revenue: 312000, leads: 98 },
  { month: "Jun", revenue: 389000, leads: 112 },
];

const sourceData = [
  { name: "Instagram", value: 42, color: "hsl(var(--chart-1))" },
  { name: "Facebook", value: 28, color: "hsl(var(--chart-2))" },
  { name: "LinkedIn", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Indicação", value: 12, color: "hsl(var(--chart-4))" },
];

const paymentsAtRisk = [
  { id: 1, lead: "Carlos Mendes", type: "PIX expirando", value: 35000, deadline: "Hoje" },
  { id: 2, lead: "Fernanda Lima", type: "Cartão recusado", value: 25000, deadline: "Ontem" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Visão Geral</h1>
        <p className="text-muted-foreground">Painel centralizado da sua operação high-ticket</p>
      </div>

      <GlobalContextSelector />

      {/* Ações e Riscos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ações de Hoje */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Ações de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayActions.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {a.overdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  <span className={a.overdue ? "text-destructive font-medium" : "text-foreground"}>{a.type}</span>
                </div>
                <span className="text-muted-foreground truncate ml-2">{a.lead}</span>
              </div>
            ))}
            <Link to="/comercial/atividades">
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs h-7">
                Ir para Atividades <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Leads Quentes Parados */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Leads Quentes Parados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hotLeadsAging.slice(0, 3).map((l) => (
              <div key={l.id} className="flex items-center justify-between text-xs">
                <span className="text-foreground truncate">{l.name}</span>
                <Badge variant="outline" className="text-xs shrink-0">{l.days}d em {l.stage}</Badge>
              </div>
            ))}
            <Link to="/crm/pipeline">
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs h-7">
                Ver Pipeline <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Gargalo do Funil */}
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Gargalo do Funil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-center py-2">
                <p className="text-lg font-bold text-foreground">Warm → Call</p>
                <p className="text-xs text-muted-foreground">Maior queda de conversão</p>
                <p className="text-2xl font-bold text-destructive mt-1">-50%</p>
                <p className="text-xs text-muted-foreground">Tempo médio: 4.2 dias</p>
              </div>
              <Link to="/performance/relatorios">
                <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                  Abrir diagnóstico <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pagamentos em Risco */}
        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-chart-4" />
              Pagamentos em Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {paymentsAtRisk.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-foreground">{p.lead}</span>
                  <p className="text-muted-foreground">{p.type}</p>
                </div>
                <span className="font-medium text-foreground shrink-0">R$ {(p.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
            <Link to="/eventos/pitch">
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs h-7">
                Ir para Monetização <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Funil Multi-funil — Assinatura HighFlow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Funil de Vendas — Visão Multi-funil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-2xl">
                <div 
                  className="h-16 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-between px-6 rounded-t-lg"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
                >
                  <span className="font-semibold text-primary-foreground">Leads Captados</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary-foreground">1.247</span>
                    <span className="text-sm text-primary-foreground/80 ml-2">100%</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-xl">
                <div 
                  className="h-16 bg-gradient-to-r from-chart-2/80 to-chart-2 flex items-center justify-between px-6"
                  style={{ clipPath: 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)' }}
                >
                  <span className="font-semibold text-white">Vendas Low Ticket</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">487</span>
                    <span className="text-sm text-white/80 ml-2">39%</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-md">
                <div 
                  className="h-16 bg-gradient-to-r from-accent/80 to-accent flex items-center justify-between px-6"
                  style={{ clipPath: 'polygon(10% 0, 90% 0, 85% 100%, 15% 100%)' }}
                >
                  <span className="font-semibold text-accent-foreground">Eventos High Ticket</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-accent-foreground">156</span>
                    <span className="text-sm text-accent-foreground/80 ml-2">12.5%</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <div 
                  className="h-16 bg-gradient-to-r from-success/80 to-success flex items-center justify-between px-6 rounded-b-lg"
                  style={{ clipPath: 'polygon(15% 0, 85% 0, 80% 100%, 20% 100%)' }}
                >
                  <span className="font-semibold text-white">Mentorias</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">76</span>
                    <span className="text-sm text-white/80 ml-2">6.1%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Lead → Low Ticket</p>
                <p className="text-2xl font-bold text-foreground">39%</p>
                <p className="text-xs text-success">+5.2% vs mês anterior</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Low Ticket → Evento</p>
                <p className="text-2xl font-bold text-foreground">32%</p>
                <p className="text-xs text-success">+3.8% vs mês anterior</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Evento → Mentoria</p>
                <p className="text-2xl font-bold text-foreground">48.7%</p>
                <p className="text-xs text-destructive">-2.1% vs mês anterior</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Receita Total" value="R$ 1.54M" icon={DollarSign} trend={{ value: 24.5, isPositive: true }} variant="success" />
        <MetricCard title="Leads Ativos" value="487" icon={Users} trend={{ value: 12.3, isPositive: true }} variant="default" />
        <MetricCard title="Taxa de Conversão" value="6.3%" icon={Target} trend={{ value: -2.1, isPositive: false }} variant="accent" />
        <MetricCard title="Ticket Médio" value="R$ 18.7k" icon={TrendingUp} trend={{ value: 8.7, isPositive: true }} variant="default" />
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">CAC Médio</p>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">R$ 2.8k</p>
            <p className="text-xs text-muted-foreground mt-1">Custo por aquisição</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">LTV Médio</p>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">R$ 24.5k</p>
            <p className="text-xs text-muted-foreground mt-1">Valor do tempo de vida</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">CAC/LTV</p>
              <Award className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">8.75x</p>
            <p className="text-xs text-success mt-1">Excelente retorno</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Retorno sobre Investimento</p>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">4.2x</p>
            <p className="text-xs text-muted-foreground mt-1">Retorno sobre anúncios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Funil de Conversão</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leads por Origem</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Evolução de Receita e Leads</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} name="Receita (R$)" />
              <Line yAxisId="right" type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} name="Leads Fechados" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link to="/eventos" className="block">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Eventos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Imersão High-Ticket Pro</p>
                    <p className="text-sm text-muted-foreground">15-17 Jul • São Paulo</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">247</p>
                    <p className="text-xs text-muted-foreground">inscritos</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Workshop Fechamento 6 Fig</p>
                    <p className="text-sm text-muted-foreground">22-23 Jul • Online</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">189</p>
                    <p className="text-xs text-muted-foreground">inscritos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/comercial/produtividade" className="block">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Produtividade dos Closers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">RC</div>
                    <div>
                      <p className="font-medium">Rafael Costa</p>
                      <p className="text-sm text-muted-foreground">12 vendas este mês</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">R$ 234k</p>
                    <p className="text-xs text-muted-foreground">receita</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">ML</div>
                    <div>
                      <p className="font-medium">Mariana Lopes</p>
                      <p className="text-sm text-muted-foreground">9 vendas este mês</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">R$ 187k</p>
                    <p className="text-xs text-muted-foreground">receita</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
