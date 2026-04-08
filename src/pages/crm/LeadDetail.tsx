import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Phone, MessageSquare, Calendar, DollarSign, TrendingUp,
  ArrowLeft, ArrowRight, Clock, FileText, UserCheck,
  Link2, Receipt, QrCode, CalendarPlus, Zap, Target, Radio, MapPin,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLeadSuggestions } from "@/lib/leadSuggestions";

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

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

/* ─── Sidebar Component ─── */
function LeadSidebar({ lead }: { lead: typeof leadData }) {
  const navigate = useNavigate();
  const suggestions = getLeadSuggestions(lead);
  const sdrActive = lead.stage === "qualificado" || lead.stage === "Engajado" || lead.stage === "lead-frio" || lead.stage === "engajado" || lead.stage === "warm";
  const closerActive = !sdrActive;

  return (
    <div className="w-80 shrink-0 border-l overflow-y-auto p-4 space-y-6">
      {/* Seção 1 — Ações Rápidas */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ações Rápidas</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/checkout-ht", { state: { leadId: lead.id, leadName: lead.name, mode: "sun-link" } })}>
            <Link2 className="h-3.5 w-3.5" /> Link SUN
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/checkout-ht", { state: { leadId: lead.id, leadName: lead.name, mode: "charge" } })}>
            <Receipt className="h-3.5 w-3.5" /> Cobrança
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5" disabled>
                <QrCode className="h-3.5 w-3.5" /> QR Code
              </Button>
            </TooltipTrigger>
            <TooltipContent>Em breve</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5" disabled>
                <CalendarPlus className="h-3.5 w-3.5" /> Evento
              </Button>
            </TooltipTrigger>
            <TooltipContent>Em breve</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Seção 2 — Sugestões IA */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sugestões IA <Badge variant="secondary" className="ml-1 text-[10px] py-0">Beta</Badge>
        </p>
        <div className="space-y-2">
          {([
            { label: "PRÓXIMA AÇÃO", value: suggestions.nextAction, icon: Zap, iconClass: "text-primary" },
            { label: "MELHOR PITCH", value: suggestions.bestPitch, icon: Target, iconClass: "text-orange-500" },
            { label: "MELHOR CANAL", value: suggestions.bestChannel, icon: Radio, iconClass: "text-blue-500" },
          ] as const).map((s) => (
            <div key={s.label} className="border rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1">
                <s.icon className={`h-3 w-3 ${s.iconClass}`} />
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-xs">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 3 — Handoff SDR → Closer */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Responsáveis</p>
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <Avatar className={`h-10 w-10 ${sdrActive ? "ring-2 ring-primary" : ""}`}>
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">AS</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">SDR</span>
            <span className="text-xs font-medium truncate max-w-[70px]">Ana Souza</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col items-center gap-1">
            <Avatar className={`h-10 w-10 ${closerActive ? "ring-2 ring-primary" : ""}`}>
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">CL</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">Closer</span>
            <span className="text-xs font-medium truncate max-w-[70px]">Carlos Lima</span>
          </div>
        </div>
      </div>

      {/* Seção 4 — Informações */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Informações</p>
        <div className="space-y-2">
          {([
            { icon: Phone, value: formatPhone(lead.phone) },
            { icon: MapPin, value: lead.origin },
            { icon: Calendar, value: `Criado ${safeTimeAgo(new Date(lead.lastContact))}` },
            { icon: FileText, value: lead.pitch ?? "—" },
            { icon: DollarSign, value: currencyFormatter.format(lead.dealValue) },
          ] as const).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <item.icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
              <span className="text-xs">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
            <TabsTrigger value="eventos" disabled>
              Eventos <Badge variant="secondary" className="ml-1.5 text-[10px] py-0">Em breve</Badge>
            </TabsTrigger>
            <TabsTrigger value="cursos" disabled>
              Cursos <Badge variant="secondary" className="ml-1.5 text-[10px] py-0">Em breve</Badge>
            </TabsTrigger>
            <TabsTrigger value="mentorias" disabled>
              Mentorias <Badge variant="secondary" className="ml-1.5 text-[10px] py-0">Em breve</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Timeline ── */}
          <TabsContent value="timeline" className="space-y-3 mt-4">
            {mockTimeline.map((ev) => {
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
            })}
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
          </TabsContent>

          {/* Disabled tabs don't need content */}
          <TabsContent value="eventos" />
          <TabsContent value="cursos" />
          <TabsContent value="mentorias" />
        </Tabs>
      </div>

      {/* ── Sidebar direita ── */}
      <LeadSidebar lead={leadData} />
    </div>
  );
}
