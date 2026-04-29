import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Plug,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Calendar,
  Activity,
} from "lucide-react";
import { formatDistanceToNow, subDays, subHours, subMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from "@/components/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { AIBadge } from "@/components/ai";
import { getMentorshipChurnInsight } from "@/lib/aiMocks";
import { InsertionChoreography } from "@/components/InsertionChoreography";
import { cn } from "@/lib/utils";

type ProductType = "course" | "mentorship" | "community";
type ProductPlatform = "nutror" | "alpaclass" | "weve";
type ProductStatus = "active" | "paused" | "archived";

interface MockProduct {
  id: string;
  name: string;
  type: ProductType;
  platform: ProductPlatform;
  status: ProductStatus;
  totalEnrolled: number;
  completionRate: number;
  avgEngagement: number;
  revenueTotal: number;
  lastSync: Date;
}

const mockProducts: MockProduct[] = [
  { id: "1", name: "Fundamentos de Vendas High-Ticket", type: "course", platform: "nutror", status: "active", totalEnrolled: 342, completionRate: 68, avgEngagement: 72, revenueTotal: 171000, lastSync: subHours(new Date(), 6) },
  { id: "2", name: "Mentoria Elite 12 Meses", type: "mentorship", platform: "alpaclass", status: "active", totalEnrolled: 25, completionRate: 40, avgEngagement: 82, revenueTotal: 300000, lastSync: subHours(new Date(), 3) },
  { id: "3", name: "Comunidade VIP Mastermind", type: "community", platform: "weve", status: "active", totalEnrolled: 156, completionRate: 0, avgEngagement: 88, revenueTotal: 156000, lastSync: subMinutes(new Date(), 45) },
  { id: "4", name: "Copywriting para Conversão", type: "course", platform: "alpaclass", status: "active", totalEnrolled: 189, completionRate: 85, avgEngagement: 65, revenueTotal: 94500, lastSync: subHours(new Date(), 12) },
  { id: "5", name: "Estratégias de Lançamento", type: "course", platform: "nutror", status: "active", totalEnrolled: 412, completionRate: 45, avgEngagement: 58, revenueTotal: 123600, lastSync: subHours(new Date(), 6) },
  { id: "6", name: "Aceleração 6 Meses", type: "mentorship", platform: "weve", status: "active", totalEnrolled: 12, completionRate: 33, avgEngagement: 91, revenueTotal: 180000, lastSync: subMinutes(new Date(), 30) },
  { id: "7", name: "Mindset do Empreendedor", type: "course", platform: "weve", status: "paused", totalEnrolled: 56, completionRate: 92, avgEngagement: 44, revenueTotal: 28000, lastSync: subDays(new Date(), 7) },
];

const typeLabels: Record<ProductType, string> = {
  course: "Curso",
  mentorship: "Mentoria",
  community: "Comunidade",
};

const platformLabels: Record<ProductPlatform, string> = {
  nutror: "Nutror",
  alpaclass: "Alpaclass",
  weve: "Weve",
};

function formatCurrencyShort(value: number) {
  if (value >= 1000) return `R$ ${Math.round(value / 1000)}K`;
  return `R$ ${value}`;
}

function getEngagementColor(value: number) {
  if (value > 70) return "text-green-600";
  if (value >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getEngagementProgressClass(value: number) {
  if (value > 70) return "[&>div]:bg-green-500";
  if (value >= 50) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

interface EngagementBarProps {
  value: number;
  threshold?: number;
  className?: string;
}

function EngagementBar({ value, threshold = 50, className }: EngagementBarProps) {
  const isHealthy = value >= threshold;
  return (
    <div className={cn("relative h-1.5 w-full bg-muted rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          isHealthy ? "bg-success" : "bg-warning",
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-foreground/30 pointer-events-none"
        style={{ left: `${threshold}%` }}
        aria-hidden
      />
    </div>
  );
}

function getTypeBadgeClass(type: ProductType) {
  switch (type) {
    case "mentorship":
      return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20";
    case "community":
      return "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 hover:bg-green-500/20";
    default:
      return "";
  }
}

export default function Portfolio() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<ProductType | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<ProductPlatform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("active");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recentlyScheduledLeadId, setRecentlyScheduledLeadId] = useState<string | null>(null);
  const googleCalendarConnected = true;

  const handleIntervention = (mentoree: { id: string; name: string }) => {
    sonnerToast.success("Mentoria agendada", {
      description: `Agendada com ${mentoree.name} para amanhã às 14h`,
    });
    setRecentlyScheduledLeadId(mentoree.id);
    setTimeout(() => setRecentlyScheduledLeadId(null), 2000);
  };

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (platformFilter !== "all" && p.platform !== platformFilter) return false;
      if (p.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, platformFilter, statusFilter]);

  const clearFilters = () => {
    setTypeFilter("all");
    setPlatformFilter("all");
    setStatusFilter("active");
  };

  const hasNoConnectedProducts = mockProducts.length === 0;

  const showChurnBlock =
    !hasNoConnectedProducts &&
    filtered.some((p) => p.type === "mentorship") &&
    (typeFilter === "all" || typeFilter === "mentorship");
  const churnData = getMentorshipChurnInsight();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Portfólio de Produtos</h1>
        <p className="text-muted-foreground">
          Seus cursos, mentorias e eventos conectados — visão unificada de performance
        </p>
      </div>

      {/* Métricas agregadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Produtos Ativos" value={7} icon={Package} variant="primary" />
        <MetricCard title="Total Matriculados" value="1.192" icon={Users} />
        <MetricCard
          title="Engajamento Médio"
          value="71%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          variant="green"
        />
        <MetricCard title="Receita de Entrega" value="R$ 784K" icon={DollarSign} variant="accent" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="course">Cursos</SelectItem>
            <SelectItem value="mentorship">Mentorias</SelectItem>
            <SelectItem value="community">Comunidades</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as typeof platformFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as plataformas</SelectItem>
            <SelectItem value="nutror">Nutror</SelectItem>
            <SelectItem value="alpaclass">Alpaclass</SelectItem>
            <SelectItem value="weve">Weve</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProductStatus)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="paused">Pausados</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estados / Grid */}
      {hasNoConnectedProducts ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Plug}
              title="Nenhuma plataforma conectada"
              description="Conecte sua conta Eduzz para sincronizar seus cursos e mentorias"
              action={{ label: "Ir para Conexões", onClick: () => navigate("/infra/integracoes") }}
              size="lg"
            />
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Package}
              title="Nenhum produto encontrado"
              description="Nenhum produto encontrado com esses filtros"
              action={{ label: "Limpar filtros", onClick: clearFilters }}
              size="lg"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {showChurnBlock && (
            <div className="border-l-4 border-l-destructive bg-destructive/5 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AIBadge variant="destructive" />
                <h3 className="text-sm font-semibold text-foreground">{churnData.title}</h3>
              </div>

              <p className="text-sm text-foreground leading-relaxed">{churnData.summary}</p>

              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        detailsOpen && "rotate-180",
                      )}
                    />
                    {detailsOpen ? "Ocultar detalhes" : "Ver detalhes dos 3 mentorados"}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
                  {churnData.mentorees.map((m) => (
                    <InsertionChoreography
                      key={m.id}
                      isNew={recentlyScheduledLeadId === m.id}
                      onComplete={() => setRecentlyScheduledLeadId(null)}
                      className="rounded-md"
                    >
                      <div className="flex items-start justify-between gap-3 bg-background/60 border border-border rounded-md p-3">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">{m.name}</span>
                            <Badge variant="outline" className="text-[10px]">
                              IEM {m.iem}% (antes {m.previousIem}%)
                            </Badge>
                            <Badge variant="destructive" className="text-[10px]">
                              {m.churnProbability}% risco
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{m.reason}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleIntervention(m)}
                        >
                          {googleCalendarConnected ? (
                            <>
                              <Calendar className="mr-2 h-3.5 w-3.5" />
                              Agendar mentoria 1:1
                            </>
                          ) : (
                            <>
                              <Activity className="mr-2 h-3.5 w-3.5" />
                              Registrar atividade
                            </>
                          )}
                        </Button>
                      </div>
                    </InsertionChoreography>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <div className="flex items-start gap-2 pt-3 border-t border-destructive/20">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{churnData.suggestion}</p>
                  <p className="text-xs text-muted-foreground">{churnData.interventionImpact}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                {/* Linha 1: badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={product.type === "course" ? "secondary" : "default"}
                    className={cn(getTypeBadgeClass(product.type))}
                  >
                    {typeLabels[product.type]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {platformLabels[product.platform]}
                  </Badge>
                </div>

                {/* Linha 2: nome */}
                <h3 className="font-semibold text-base leading-snug line-clamp-2">
                  {product.name}
                </h3>

                {/* Linha 3: mini-métricas 2x2 */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>
                      <span className="text-foreground font-medium">{product.totalEnrolled}</span> matric.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>
                      <span className="text-foreground font-medium">{product.completionRate}%</span> concl.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>
                      <span className={cn("font-medium", getEngagementColor(product.avgEngagement))}>
                        {product.avgEngagement}%
                      </span>{" "}
                      engaj.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span className="text-foreground font-medium">
                      {formatCurrencyShort(product.revenueTotal)}
                    </span>
                  </div>
                </div>

                {/* Linha 4: barra de engajamento */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Engajamento</span>
                    <span className={cn("font-medium", getEngagementColor(product.avgEngagement))}>
                      {product.avgEngagement}%
                    </span>
                  </div>
                  <EngagementBar value={product.avgEngagement} threshold={50} />
                </div>

                {/* Linha 5: último sync */}
                <p className="text-xs text-muted-foreground">
                  Último sync:{" "}
                  {formatDistanceToNow(product.lastSync, { addSuffix: true, locale: ptBR })}
                </p>

                {/* Linha 6: ações */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Ver no {platformLabels[product.platform]}
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Filtro por produto em breve",
                        description: `Em breve você poderá ver os leads de "${product.name}".`,
                      });
                      navigate("/crm/leads");
                    }}
                  >
                    Ver Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </>
      )}
    </div>
  );
}