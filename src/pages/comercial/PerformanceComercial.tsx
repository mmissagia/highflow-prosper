import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import {
  Phone, Calendar, CheckCircle, Target, DollarSign, TrendingUp, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MetricGroup, type MetricItem } from "@/components/MetricGroup";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | "SDR" | "CLOSER";

const roleStyles: Record<string, string> = {
  SDR: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  CLOSER: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  LÍDER: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
};

export default function PerformanceComercial() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("30");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const { data: salesUsers, isLoading: loadingSU } = useQuery({
    queryKey: ["sales_users"],
    queryFn: async () => {
      const { data } = await supabase.from("sales_users").select("*").eq("status", "active");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: activities, isLoading: loadingAct } = useQuery({
    queryKey: ["sales_activities"],
    queryFn: async () => {
      const { data } = await supabase.from("sales_activities").select("*");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: deals, isLoading: loadingDeals } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data } = await supabase.from("deals").select("*");
      return data || [];
    },
    enabled: !!user,
  });

  const isLoading = loadingSU || loadingAct || loadingDeals;
  const su = salesUsers || [];
  const act = activities || [];
  const dl = deals || [];

  // Global metrics
  const totalCalls = act.filter((a: any) => a.activity_type === "CALL" || a.activity_type === "WHATSAPP").length;
  const meetingsScheduled = act.filter((a: any) => a.activity_type === "MEETING_SCHEDULED").length;
  const meetingsDone = act.filter((a: any) => a.activity_type === "MEETING_DONE").length;
  const noShows = act.filter((a: any) => a.activity_type === "NO_SHOW").length;
  const wonDeals = dl.filter((d: any) => d.stage === "won");
  const totalRevenue = wonDeals.reduce((acc: number, d: any) => acc + Number(d.amount_value || 0), 0);
  const avgTicket = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
  const closeRate = meetingsDone > 0 ? ((wonDeals.length / meetingsDone) * 100) : 0;
  const showRate = meetingsScheduled > 0 ? (((meetingsScheduled - noShows) / meetingsScheduled) * 100) : 0;

  // Funnel data
  const funnelData = [
    { name: "Contatos", value: totalCalls },
    { name: "Reuniões Agend.", value: meetingsScheduled },
    { name: "Reuniões Realiz.", value: meetingsDone },
    { name: "Fechamentos", value: wonDeals.length },
  ];
  const funnelMax = Math.max(...funnelData.map((d) => d.value), 1);
  const funnelWithRate = funnelData.map((d, i) => ({
    ...d,
    rate: i === 0 ? null : funnelData[i - 1].value > 0 ? ((d.value / funnelData[i - 1].value) * 100).toFixed(1) + "%" : "0%",
  }));
  const barOpacities = [1, 0.8, 0.6, 0.45];

  // Per-professional data
  const filteredUsers = su.filter((s: any) =>
    roleFilter === "all" ? true : s.role?.toUpperCase() === roleFilter
  );

  function profMetrics(prof: any) {
    const pAct = act.filter((a: any) => a.sales_user_id === prof.id);
    const contacts = pAct.filter((a: any) => a.activity_type === "CALL" || a.activity_type === "WHATSAPP").length;
    const meetings = pAct.filter((a: any) => a.activity_type === "MEETING_DONE").length;
    const won = dl.filter((d: any) => d.closer_id === prof.id && d.stage === "won");
    const revenue = won.reduce((acc: number, d: any) => acc + Number(d.amount_value || 0), 0);
    const rate = meetings > 0 ? (won.length / meetings) * 100 : 0;
    const goalPct = Number(prof.monthly_goal_value || 0) > 0 ? (revenue / Number(prof.monthly_goal_value)) * 100 : 0;
    return { contacts, meetings, won: won.length, revenue, rate, goalPct };
  }

  function initials(name: string) {
    return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Comercial</h1>
          <p className="text-muted-foreground">KPIs da equipe e individuais</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Hoje</SelectItem>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
            <SelectItem value="90">90 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* MetricGroup: 2 destaque + 6 pills */}
      <MetricGroup
        primary={[
          {
            id: "receita",
            title: "Receita Gerada",
            value: `R$ ${(totalRevenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            variant: "success",
            trend: { value: 24 },
            subtitle: "vs. mês anterior",
          },
          {
            id: "taxa-fechamento",
            title: "Taxa de Fechamento",
            value: `${closeRate.toFixed(1)}%`,
            icon: Target,
            variant: "accent",
            trend: { value: 2 },
          },
        ]}
        secondary={[
          { id: "contatos", title: "Contatos", value: totalCalls, icon: Phone },
          { id: "agendadas", title: "Reuniões agendadas", value: meetingsScheduled, icon: Calendar },
          { id: "realizadas", title: "Reuniões realizadas", value: meetingsDone, icon: CheckCircle },
          { id: "fechamentos", title: "Fechamentos", value: wonDeals.length, icon: Target },
          { id: "ticket", title: "Ticket Médio", value: `R$ ${avgTicket.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, icon: TrendingUp },
          { id: "comparecimento", title: "Taxa Comparecimento", value: `${showRate.toFixed(1)}%`, icon: Users },
        ]}
      />

      {/* Seção 3 — Funil */}
      <Card className="border hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-base">Funil de Conversão Comercial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelWithRate} layout="vertical" margin={{ left: 10, right: 60, top: 0, bottom: 0 }} barCategoryGap="28%">
                <XAxis type="number" hide domain={[0, funnelMax * 1.15]} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [v, "Total"]} cursor={false} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
                  {funnelWithRate.map((_, i) => (
                    <Cell key={i} fill={`hsl(var(--chart-1) / ${barOpacities[i]})`} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(v: number) => v}
                    style={{ fontSize: 13, fontWeight: 600, fill: "hsl(var(--foreground))" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-2 text-xs text-muted-foreground pl-[130px]">
            {funnelWithRate.slice(1).map((d) => (
              <span key={d.name}>→ {d.rate}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção 4 — Tabela por profissional */}
      <Card className="border hover:shadow-md transition-all">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Performance por Profissional</CardTitle>
          <div className="flex gap-1">
            {(["all", "SDR", "CLOSER"] as RoleFilter[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant="ghost"
                className={cn("h-7 text-xs px-3 rounded-md", roleFilter === r && "bg-muted font-semibold")}
                onClick={() => setRoleFilter(r)}
              >
                {r === "all" ? "Todos" : r}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {su.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-sm font-medium">Nenhum profissional cadastrado</p>
              <p className="text-xs text-muted-foreground">Cadastre sua equipe comercial para acompanhar a performance</p>
              <Button size="sm" className="mt-2" onClick={() => navigate("/comercial/equipe")}>Cadastrar Equipe</Button>
            </div>
          ) : (
            (() => {
              type ProfRow = { prof: any; m: ReturnType<typeof profMetrics>; role: string };
              const rows: ProfRow[] = filteredUsers.map((prof: any) => ({
                prof,
                m: profMetrics(prof),
                role: (prof.role || "").toUpperCase(),
              }));
              const cols: DataTableColumn<ProfRow>[] = [
                {
                  id: "profissional",
                  header: "Profissional",
                  accessor: ({ prof }) => (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(prof.name)}
                      </div>
                      <span className="font-medium text-sm truncate">{prof.name}</span>
                    </div>
                  ),
                },
                {
                  id: "funcao",
                  header: "Função",
                  accessor: ({ prof, role }) => (
                    <Badge variant="outline" className={cn("text-[11px] border", roleStyles[role] || "")}>
                      {prof.role}
                    </Badge>
                  ),
                },
                {
                  id: "fechamentos",
                  header: "Fechamentos",
                  accessor: ({ m }) => (m.won === 0 ? <span className="text-muted-foreground">—</span> : m.won),
                },
                {
                  id: "receita",
                  header: "Receita",
                  align: "right",
                  accessor: ({ m }) => (
                    <span className={cn("text-sm font-medium tabular-nums", m.revenue > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
                      {m.revenue > 0 ? `R$ ${m.revenue.toLocaleString("pt-BR")}` : "R$ 0"}
                    </span>
                  ),
                },
                {
                  id: "taxa",
                  header: "Taxa Fech.",
                  accessor: ({ m }) =>
                    m.rate > 20 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 text-[11px]">{m.rate.toFixed(1)}%</Badge>
                    ) : m.rate >= 10 ? (
                      <span className="text-sm">{m.rate.toFixed(1)}%</span>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 text-[11px]">{m.rate.toFixed(1)}%</Badge>
                    ),
                },
                {
                  id: "contatos",
                  header: "Contatos",
                  expandable: true,
                  accessor: ({ m, role }) =>
                    m.contacts === 0 && role === "CLOSER" ? "—" : m.contacts,
                },
                {
                  id: "reunioes",
                  header: "Reuniões",
                  expandable: true,
                  accessor: ({ m, role }) =>
                    m.meetings === 0 && role === "SDR" ? "—" : m.meetings,
                },
              ];
              return (
                <DataTable<ProfRow>
                  data={rows}
                  columns={cols}
                  rowKey={(r) => String(r.prof.id)}
                />
              );
            })()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
