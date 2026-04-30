import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone, MessageSquare, Calendar, DollarSign, TrendingUp,
  ArrowLeft, ArrowRight, Clock, FileText, UserCheck, Inbox, Briefcase, ShoppingBag,
  BookOpen, ExternalLink,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow, format, subDays, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeadSidebar } from "@/components/crm/LeadSidebar";
import { LeadDetailSidebar } from "@/components/LeadDetailSidebar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/* ─── lead mock (same fields as pipeline cards) ─── */
const leadData = {
  id: 1,
  name: "Rafael Mendonça",
  email: "rafael@email.com",
  phone: "11991234567",
  stage: "Engajado",
  origin: "Instagram",
  score: 85,
  dealValue: 18000,
  responsible: "Carlos Lima",
  lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  pitch: "Mentoria Elite 12 meses",
};

/* ─── mock data ─── */
const mockTimeline = [
  { id: 1, type: "message" as const, icon: "MessageSquare" as const, channel: "WhatsApp", description: "Lead respondeu positivamente à sequência de aquecimento. Demonstrou interesse na Mentoria Elite.", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 2, type: "stage" as const, icon: "TrendingUp" as const, channel: null, description: "Stage atualizado: Leads Frios → Qualificado", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: 3, type: "call" as const, icon: "Phone" as const, channel: "Ligação", description: "SDR realizou call de qualificação. Duração: 18min. Lead confirmou orçamento disponível acima de R$ 15.000.", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 4, type: "meeting" as const, icon: "Calendar" as const, channel: null, description: "Reunião de diagnóstico agendada para próxima semana.", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 5, type: "message" as const, icon: "MessageSquare" as const, channel: "Email", description: 'Lead entrou pelo formulário da landing page da campanha "Meta Ads — Mentoria Elite Jan/26".', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
];

const mockActivities = [
  { type: "call", description: "Call de qualificação realizada", responsible: "Ana Souza (SDR)", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), duration: "18min" },
  { type: "message", description: "Sequência WhatsApp enviada — 3 mensagens", responsible: "Automação", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), duration: null },
  { type: "meeting", description: "Reunião de diagnóstico agendada", responsible: "Carlos Lima (Closer)", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), duration: null },
];

const mockDeals = [
  { name: "Mentoria Elite 12 meses", value: 18000, status: "em negociação", pitch: "Pitch Mentoria Elite", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
];

const mockSunHistory = [
  { product: "Curso Tráfego Pago Avançado", value: 997, date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), status: "pago" },
  { product: "Masterclass Copywriting", value: 297, date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), status: "pago" },
  { product: "Evento Presencial — Summit Digital", value: 1500, date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), status: "pago" },
];

type EnrollmentType = "course" | "mentorship" | "community";
type EnrollmentStatus = "active" | "completed" | "cancelled";

const mockEnrollments: Array<{
  id: number;
  productName: string;
  type: EnrollmentType;
  platform: string;
  status: EnrollmentStatus;
  progress: number;
  engagementScore: number;
  lastActivity: Date;
}> = [
  { id: 1, productName: "Fundamentos de Vendas High-Ticket", type: "course", platform: "Nutror", status: "active", progress: 67, engagementScore: 72, lastActivity: subDays(new Date(), 3) },
  { id: 2, productName: "Mentoria Elite 12 Meses", type: "mentorship", platform: "Alpaclass", status: "active", progress: 40, engagementScore: 82, lastActivity: subDays(new Date(), 1) },
  { id: 3, productName: "Comunidade VIP Mastermind", type: "community", platform: "Weve", status: "active", progress: 0, engagementScore: 88, lastActivity: subHours(new Date(), 5) },
];

const enrollmentTypeLabels: Record<EnrollmentType, string> = {
  course: "Curso",
  mentorship: "Mentoria",
  community: "Comunidade",
};

function getEnrollmentTypeBadgeClass(type: EnrollmentType) {
  switch (type) {
    case "mentorship":
      return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
    case "community":
      return "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30";
    default:
      return "";
  }
}

function getStatusBadge(status: EnrollmentStatus) {
  switch (status) {
    case "active":
      return { variant: "default" as const, label: "Ativo", className: "bg-green-500 hover:bg-green-600 text-white" };
    case "completed":
      return { variant: "secondary" as const, label: "Concluído", className: "" };
    case "cancelled":
      return { variant: "destructive" as const, label: "Cancelado", className: "" };
  }
}

function getIemBadgeClass(value: number) {
  if (value >= 70) return "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30";
  if (value >= 50) return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
  return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const iconMap = {
  MessageSquare,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
} as const;

function getScoreClasses(score: number) {
  if (score >= 70) return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
  if (score >= 40) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
  return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
}

function safeTimeAgo(date: Date) {
  try {
    if (isNaN(date.getTime())) return "—";
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  } catch {
    return "—";
  }
}

export default function LeadDetail() {
  const { id } = useParams();

  const initials = leadData.name.split(" ").map((n) => n[0]).join("");
  const sunTotal = mockSunHistory.reduce((s, i) => s + i.value, 0);

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Coluna principal ── */}
      <div className="flex-1 min-w-0 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/crm/pipeline">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Pipeline
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{leadData.name}</h1>
            <Badge variant="outline">{leadData.stage}</Badge>
            <Badge variant="secondary">{leadData.origin}</Badge>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getScoreClasses(leadData.score)}`}>
              {leadData.score}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="comercial">Comercial</TabsTrigger>
            <TabsTrigger value="sun">Histórico SUN</TabsTrigger>
            <TabsTrigger value="entrega">Entrega</TabsTrigger>
            <TabsTrigger value="eventos" disabled>
              Eventos <Badge variant="secondary" className="ml-1.5 text-[10px] py-0">Em breve</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Timeline ── */}
          <TabsContent value="timeline" className="space-y-3 mt-4">
            {mockTimeline.length === 0 ? (
              <EmptyState icon={Inbox} title="Nenhum evento na timeline" description="Interações, mudanças de estágio e mensagens aparecerão aqui." size="sm" />
            ) : (
              mockTimeline.map((ev) => {
                const Icon = iconMap[ev.icon];
                return (
                  <div key={ev.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="mt-0.5 p-2 rounded-full bg-primary/10 h-fit">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm text-foreground">{ev.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{safeTimeAgo(ev.createdAt)}</span>
                        {ev.channel && <Badge variant="outline" className="text-[10px] py-0">{ev.channel}</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* ── Comercial ── */}
          <TabsContent value="comercial" className="space-y-6 mt-4">
            {/* Responsáveis */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Responsáveis</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">AS</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Ana Souza</p>
                    <Badge variant="outline" className="text-[10px] py-0">SDR</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" disabled>
                    <UserCheck className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">CL</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Carlos Lima</p>
                    <Badge variant="outline" className="text-[10px] py-0">Closer</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" disabled>
                    <UserCheck className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Atividades */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Atividades</h3>
              {mockActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                    {act.type === "call" && <Phone className="h-3.5 w-3.5 text-primary" />}
                    {act.type === "message" && <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                    {act.type === "meeting" && <Calendar className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{act.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {act.responsible} · {safeTimeAgo(act.date)}
                      {act.duration && ` · ${act.duration}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Deals */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Deals</h3>
              {mockDeals.map((deal, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{deal.name}</p>
                      <Badge variant="outline" className="text-amber-600 border-amber-500/50">{deal.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {currencyFormatter.format(deal.value)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {deal.pitch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {safeTimeAgo(deal.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Histórico SUN ── */}
          <TabsContent value="sun" className="space-y-4 mt-4">
            {mockSunHistory.length === 0 ? (
              <EmptyState icon={ShoppingBag} title="Sem compras registradas" description="Quando o lead comprar produtos low-ticket ou ingressos, o histórico aparecerá aqui." size="sm" />
            ) : (
              <>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Total investido na Eduzz</p>
                  <p className="text-xl font-bold text-foreground">{currencyFormatter.format(sunTotal)}</p>
                </div>
                <div className="space-y-3">
                  {mockSunHistory.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.product}</p>
                        <p className="text-xs text-muted-foreground">{format(item.date, "dd/MM/yyyy")}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold">{currencyFormatter.format(item.value)}</span>
                        <Badge variant="outline" className="text-green-600 border-green-500/50">{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Disabled tabs don't need content */}
          <TabsContent value="eventos" />

          {/* ── Entrega ── */}
          <TabsContent value="entrega" className="space-y-3 mt-4">
            {mockEnrollments.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Este lead ainda não está matriculado em nenhum produto conectado."
                description="Dados de entrega aparecem automaticamente após integração."
                size="sm"
              />
            ) : (
              mockEnrollments.map((en) => {
                const status = getStatusBadge(en.status);
                return (
                  <Card key={en.id}>
                    <CardContent className="p-4 space-y-3">
                      {/* Linha 1: nome + badges */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <p className="text-sm font-semibold text-foreground">{en.productName}</p>
                          <Badge variant="outline" className={cn(getEnrollmentTypeBadgeClass(en.type))}>
                            {enrollmentTypeLabels[en.type]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{en.platform}</Badge>
                        </div>
                      </div>

                      {/* Linha 2: status */}
                      <div>
                        <Badge variant={status.variant} className={cn(status.className)}>
                          {status.label}
                        </Badge>
                      </div>

                      {/* Linha 3: progresso */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progresso</span>
                          <span className="font-medium text-foreground">{en.progress}% concluído</span>
                        </div>
                        <Progress value={en.progress} className="h-1.5" />
                      </div>

                      {/* Linha 4: IEM */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(getIemBadgeClass(en.engagementScore))}>
                          IEM: {en.engagementScore}%
                        </Badge>
                      </div>

                      {/* Linha 5: última atividade */}
                      <p className="text-xs text-muted-foreground">
                        Última atividade: {safeTimeAgo(en.lastActivity)}
                      </p>

                      {/* Linha 6: ação */}
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            Ver no {en.platform}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Sidebar direita ── */}
      <div className="hidden lg:flex flex-col">
        <LeadDetailSidebar
          className="w-80 shrink-0 border-l"
          lead={{
            id: leadData.id,
            name: leadData.name,
            stage: leadData.stage,
            score: leadData.score,
            timeInStage: "5 dias",
          }}
        />
        <LeadSidebar lead={leadData} />
      </div>
    </div>
  );
}
