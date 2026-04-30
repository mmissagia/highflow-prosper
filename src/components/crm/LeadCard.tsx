import { Card } from "@/components/ui/card";
import { Clock, Flame, Sparkles, User, Package, Globe } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getLeadScoreTooltip } from "@/lib/aiMocks";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  if (score >= 80) return "bg-success/10 text-success";
  if (score >= 50) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

interface LeadCardProps {
  lead: LeadData;
  draggingId: number | null;
  onDragStart: (e: React.DragEvent, leadId: number) => void;
  onDragEnd: () => void;
}

export function LeadCard({ lead, draggingId, onDragStart, onDragEnd }: LeadCardProps) {
  const isDragging = draggingId === lead.id;

  const lastContactLabel = (() => {
    try {
      const d = new Date(lead.lastContact);
      if (isNaN(d.getTime())) return "—";
      return formatDistanceToNow(d, { locale: ptBR, addSuffix: true });
    } catch {
      return "—";
    }
  })();

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Use a transparent drag image so the native <a> ghost doesn't appear,
        // and ensure the dataTransfer is set by the parent handler.
        onDragStart(e, lead.id);
      }}
      onDragEnd={onDragEnd}
      className={`cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? "opacity-50" : ""}`}
    >
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Link
            to={`/crm/lead/${lead.id}`}
            className="block"
            draggable={false}
            onDragStart={(e) => {
              // Prevent the <a>'s native drag (which sets URL as drag data
              // and shows a link ghost). The parent div handles the drag.
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              // If a drag just happened, suppress the navigation click.
              if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <Card className="group p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-background">
              <div className="space-y-2">
                {/* DEFAULT — nome + score */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate flex-1">
                    {lead.name}
                  </p>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn(
                      "h-7 px-2 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 gap-0.5",
                      getScoreClasses(lead.score),
                    )}
                    title={getLeadScoreTooltip(lead.score, lead.stage)}
                  >
                    {lead.score >= 85 && <Flame className="h-3 w-3" />}
                    <span>{lead.score}</span>
                  </div>
                </div>

                {/* DEFAULT — valor */}
                <p className="text-sm font-semibold text-success tabular-nums">
                  {currencyFormatter.format(lead.dealValue)}
                </p>
              </div>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs space-y-1.5 p-3">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Tempo na etapa:</span>
            <span className="font-medium">{lastContactLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Responsável:</span>
            <span className="font-medium">{lead.responsible}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Produto:</span>
            <span className="font-medium">{lead.pitch ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Plataforma:</span>
            <span className="font-medium">{lead.origin}</span>
          </div>
          <div className="pt-1.5 mt-1.5 border-t flex items-start gap-1.5">
            <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-snug">
              {getLeadScoreTooltip(lead.score, lead.stage)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
