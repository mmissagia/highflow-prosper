import { useGlobalFilters } from "@/contexts/GlobalFilterContext";
import { useStrategy } from "@/contexts/StrategyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const periodOptions = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "month", label: "Mês atual" },
  { value: "custom", label: "Personalizado" },
];

const eventOptions = [
  { value: "all", label: "Todos os Eventos" },
  { value: "imersao-ht", label: "Imersão High-Ticket Pro" },
  { value: "workshop-6fig", label: "Workshop Fechamento 6 Fig" },
  { value: "blanket", label: "Blanket" },
];

const pipelineOptions = [
  { value: "all", label: "Todos os Funis" },
  { value: "mentoria", label: "Mentoria High Ticket" },
  { value: "evento", label: "Evento Presencial" },
  { value: "mastermind", label: "Mastermind" },
];

const teamOptions = [
  { value: "all", label: "Todo o Time" },
  { value: "sdrs", label: "SDRs" },
  { value: "closers", label: "Closers" },
  { value: "ana-ribeiro", label: "Ana Ribeiro" },
  { value: "lucas-martins", label: "Lucas Martins" },
  { value: "rafael-costa", label: "Rafael Costa" },
  { value: "mariana-lopes", label: "Mariana Lopes" },
];

const originOptions = [
  { value: "all", label: "Todas as Origens" },
  { value: "meta-ads", label: "Meta Ads" },
  { value: "instagram", label: "Instagram" },
  { value: "indicacao", label: "Indicação" },
  { value: "evento", label: "Evento" },
  { value: "low-ticket", label: "Low Ticket" },
];

const filterLabels: Record<string, string> = {
  period: "Período",
  event: "Evento",
  pipeline: "Funil",
  team: "Time",
  origin: "Origem",
};

function getLabelForValue(key: string, value: string): string {
  const optionsMap: Record<string, { value: string; label: string }[]> = {
    period: periodOptions,
    event: eventOptions,
    pipeline: pipelineOptions,
    team: teamOptions,
    origin: originOptions,
  };
  return optionsMap[key]?.find((o) => o.value === value)?.label || value;
}

export function GlobalContextSelector() {
  const { filters, setFilter, clearFilters, activeFilterCount } = useGlobalFilters();
  const { selectedStrategyId, setSelectedStrategyId } = useStrategy();

  const { data: strategies = [] } = useQuery({
    queryKey: ['strategies-selector'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('id, name')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const hasStrategies = strategies.length > 0;

  const activeChips = Object.entries(filters).filter(
    ([key, value]) => {
      if (key === "period") return value !== "30d";
      return value !== "all";
    }
  );

  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mr-1">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Contexto</span>
        </div>

        <Select value={filters.period} onValueChange={(v) => setFilter("period", v)}>
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.event} onValueChange={(v) => setFilter("event", v)}>
          <SelectTrigger className="w-[170px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.pipeline} onValueChange={(v) => setFilter("pipeline", v)}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pipelineOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.team} onValueChange={(v) => setFilter("team", v)}>
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {teamOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedStrategyId ?? ""}
          onValueChange={(v) => setSelectedStrategyId(v || null)}
          disabled={!hasStrategies}
        >
          <SelectTrigger className="w-[170px] h-8 text-xs">
            <SelectValue placeholder={hasStrategies ? "Todas as estratégias" : "Nenhuma estratégia"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as estratégias</SelectItem>
            {strategies.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(activeFilterCount > 0 || selectedStrategyId) && (
          <Button variant="ghost" size="sm" onClick={() => { clearFilters(); setSelectedStrategyId(null); }} className="h-8 text-xs text-muted-foreground">
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filtros ativos:</span>
          {activeChips.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="text-xs gap-1">
              {filterLabels[key]}: {getLabelForValue(key, value)}
              <button onClick={() => setFilter(key as any, key === "period" ? "30d" : "all")} className="ml-0.5 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
