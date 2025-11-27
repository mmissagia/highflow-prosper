import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Phone,
  Zap,
  Award
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Geral</h1>
        <p className="text-muted-foreground">Visão 360º da sua operação high-ticket</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Receita Total"
          value="R$ 1.54M"
          icon={DollarSign}
          trend={{ value: 24.5, isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Leads Ativos"
          value="487"
          icon={Users}
          trend={{ value: 12.3, isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Taxa de Conversão"
          value="6.3%"
          icon={Target}
          trend={{ value: -2.1, isPositive: false }}
          variant="accent"
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 18.7k"
          icon={TrendingUp}
          trend={{ value: 8.7, isPositive: true }}
          variant="default"
        />
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
            <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
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
              <p className="text-sm font-medium text-muted-foreground">ROAS Estimado</p>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">4.2x</p>
            <p className="text-xs text-muted-foreground mt-1">Return on ad spend</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
          </CardHeader>
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

        {/* Origens de Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por Origem</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
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

      {/* Evolução de Receita */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Receita e Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Receita (R$)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="leads" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Leads Fechados"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Eventos e Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Eventos Ativos (Blinket)
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Performance dos Closers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    RC
                  </div>
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
                  <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <p className="font-medium">Marina Silva</p>
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
      </div>
    </div>
  );
}
