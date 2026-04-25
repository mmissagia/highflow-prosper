import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DollarSign, Clock, FileText, Phone, Mail, MessageCircle, Flame, Sparkles } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getLeadScoreTooltip } from "@/lib/aiMocks";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

export interface LeadData {
  id: number;
  name: string;
  stage: string;
  origin: string;
  score: number;
  dealValue: number;
  responsible: string;
  lastContact: string;
  pitch: string | null;
  phone: string;
  email: string;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getScoreClasses(score: number) {
  if (score >= 70) return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
  if (score >= 40) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
  return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
}

interface LeadCardProps {
  lead: LeadData;
  draggingId: number | null;
  onDragStart: (e: React.DragEvent, leadId: number) => void;
  onDragEnd: () => void;
}

export function LeadCard({ lead, draggingId, onDragStart, onDragEnd }: LeadCardProps) {
  const initials = lead.responsible
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onDragEnd={onDragEnd}
      className={`cursor-grab active:cursor-grabbing transition-opacity ${draggingId === lead.id ? "opacity-50" : ""}`}
    >
      <Link to={`/crm/lead/${lead.id}`}>
        <Card className="group p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-background">
          <div className="space-y-2">
            {/* ZONA 1 — Cabeçalho */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <Badge variant="outline" className="text-xs">
                  {lead.origin}
                </Badge>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 gap-0.5 cursor-help ${getScoreClasses(lead.score)}`}
                  >
                    {lead.score >= 85 && <Flame className="h-3 w-3 text-orange-500" />}
                    <span>{lead.score}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed">{getLeadScoreTooltip(lead.score, lead.stage)}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* ZONA 2 — Dados */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{currencyFormatter.format(lead.dealValue)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5 flex-shrink-0">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[80px]">{lead.responsible}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {(() => {
                    try {
                      const d = new Date(lead.lastContact);
                      if (isNaN(d.getTime())) return "—";
                      return formatDistanceToNow(d, { locale: ptBR, addSuffix: true });
                    } catch {
                      return "—";
                    }
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.pitch ?? "—"}</span>
              </div>
            </div>

            {/* ZONA 3 — Ações rápidas */}
            <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`tel:${lead.phone}`, "_self");
                }}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-green-600 hover:text-green-700"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    `https://wa.me/55${lead.phone.replace(/\D/g, "")}`,
                    "_blank"
                  );
                }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`mailto:${lead.email}`, "_self");
                }}
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
