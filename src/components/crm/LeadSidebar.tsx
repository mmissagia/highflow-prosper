import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Phone, Calendar, DollarSign, ArrowRight, FileText,
  Link2, Receipt, QrCode, CalendarPlus, Zap, Target, Radio, MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLeadSuggestions } from "@/lib/leadSuggestions";

interface LeadSidebarProps {
  lead: {
    id: number;
    name: string;
    phone: string;
    stage: string;
    origin: string;
    score: number;
    dealValue: number;
    lastContact: string;
    pitch: string | null;
  };
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

function safeTimeAgo(date: Date) {
  try {
    if (isNaN(date.getTime())) return "—";
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  } catch {
    return "—";
  }
}

export function LeadSidebar({ lead }: LeadSidebarProps) {
  const navigate = useNavigate();
  const suggestions = getLeadSuggestions(lead);
  const sdrActive = ["qualificado", "Engajado", "lead-frio", "engajado", "warm"].includes(lead.stage);
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
