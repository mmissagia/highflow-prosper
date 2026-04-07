import { useState } from "react";
import { useStrategy } from "@/contexts/StrategyContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Target } from "lucide-react";

// Colors for dynamic funnel steps
const STEP_COLORS = [
  "from-primary/80 to-primary",
  "from-chart-2/80 to-chart-2",
  "from-accent/80 to-accent",
  "from-success/80 to-success",
  "from-chart-4/80 to-chart-4",
  "from-chart-5/80 to-chart-5",
];

const TEXT_COLORS = [
  "text-primary-foreground",
  "text-white",
  "text-accent-foreground",
  "text-white",
  "text-white",
  "text-white",
];

interface ProcessedStep {
  nodeId: string;
  label: string;
  conversionRate: number | null;
}

function processStrategyToSteps(
  nodes: Array<{ id: string; data?: { label?: string } }>,
  edges: Array<{ source: string; target: string; data?: { conversionRate?: number } }>
): ProcessedStep[] {
  if (!nodes || nodes.length === 0) return [];

  // Build adjacency: source -> { target, conversionRate }
  const edgeMap = new Map<string, { target: string; conversionRate: number | null }>();
  const targetSet = new Set<string>();

  for (const edge of edges) {
    edgeMap.set(edge.source, {
      target: edge.target,
      conversionRate: edge.data?.conversionRate ?? null,
    });
    targetSet.add(edge.target);
  }

  // Find root node (not a target of any edge)
  let startId = nodes[0]?.id;
  for (const node of nodes) {
    if (!targetSet.has(node.id)) {
      startId = node.id;
      break;
    }
  }

  // Walk the chain
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const steps: ProcessedStep[] = [];
  let currentId: string | undefined = startId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const node = nodeMap.get(currentId);
    if (!node) break;

    const edge = edgeMap.get(currentId);
    steps.push({
      nodeId: currentId,
      label: node.data?.label || "Sem nome",
      conversionRate: edge?.conversionRate ?? null,
    });
    currentId = edge?.target;
  }

  // Add orphan nodes not in the chain
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      steps.push({
        nodeId: node.id,
        label: node.data?.label || "Sem nome",
        conversionRate: null,
      });
    }
  }

  return steps;
}

function StaticFunnel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-full">
          <div
            className="h-14 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-between px-6 rounded-t-lg"
            style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}
          >
            <span className="font-semibold text-primary-foreground text-sm">Leads Captados</span>
            <div className="text-right">
              <span className="text-xl font-bold text-primary-foreground">1.247</span>
              <span className="text-xs text-primary-foreground/80 ml-1">100%</span>
            </div>
          </div>
        </div>
        <div className="w-[85%]">
          <div
            className="h-14 bg-gradient-to-r from-chart-2/80 to-chart-2 flex items-center justify-between px-6"
            style={{ clipPath: "polygon(5% 0, 95% 0, 90% 100%, 10% 100%)" }}
          >
            <span className="font-semibold text-white text-sm">Vendas Low Ticket</span>
            <div className="text-right">
              <span className="text-xl font-bold text-white">487</span>
              <span className="text-xs text-white/80 ml-1">39%</span>
            </div>
          </div>
        </div>
        <div className="w-[65%]">
          <div
            className="h-14 bg-gradient-to-r from-accent/80 to-accent flex items-center justify-between px-6"
            style={{ clipPath: "polygon(10% 0, 90% 0, 85% 100%, 15% 100%)" }}
          >
            <span className="font-semibold text-accent-foreground text-sm">Eventos HT</span>
            <div className="text-right">
              <span className="text-xl font-bold text-accent-foreground">156</span>
              <span className="text-xs text-accent-foreground/80 ml-1">12.5%</span>
            </div>
          </div>
        </div>
        <div className="w-[45%]">
          <div
            className="h-14 bg-gradient-to-r from-success/80 to-success flex items-center justify-between px-6 rounded-b-lg"
            style={{ clipPath: "polygon(15% 0, 85% 0, 80% 100%, 20% 100%)" }}
          >
            <span className="font-semibold text-white text-sm">Mentorias</span>
            <div className="text-right">
              <span className="text-xl font-bold text-white">76</span>
              <span className="text-xs text-white/80 ml-1">6.1%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Lead → Low Ticket</p>
          <p className="text-lg font-bold text-foreground">39%</p>
          <p className="text-[10px] text-success">+5.2% vs mês anterior</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Low Ticket → Evento</p>
          <p className="text-lg font-bold text-foreground">32%</p>
          <p className="text-[10px] text-success">+3.8% vs mês anterior</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Evento → Mentoria</p>
          <p className="text-lg font-bold text-foreground">48.7%</p>
          <p className="text-[10px] text-destructive">-2.1% vs mês anterior</p>
        </div>
      </div>
    </div>
  );
}

function FunnelSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-14 w-full bg-muted animate-pulse rounded-lg" />
      <div className="h-14 w-[80%] mx-auto bg-muted animate-pulse rounded-lg" />
      <div className="h-14 w-[60%] mx-auto bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

function DynamicFunnel({ steps }: { steps: ProcessedStep[] }) {
  const totalSteps = steps.length;

  return (
    <div className="space-y-1">
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => {
          const widthPercent = 100 - (i / Math.max(totalSteps - 1, 1)) * 55;
          const inset = ((100 - widthPercent) / 2);
          const clipInset = Math.min(5 + i * 3, 20);
          const colorIdx = i % STEP_COLORS.length;
          const isFirst = i === 0;
          const isLast = i === totalSteps - 1;

          return (
            <div key={step.nodeId} className="w-full flex flex-col items-center">
              {/* Transition arrow between steps */}
              {i > 0 && (
                <TransitionPopover
                  fromLabel={steps[i - 1].label}
                  toLabel={step.label}
                  conversionRate={steps[i - 1].conversionRate}
                />
              )}
              {/* Funnel bar */}
              <div style={{ width: `${widthPercent}%` }}>
                <div
                  className={`h-14 bg-gradient-to-r ${STEP_COLORS[colorIdx]} flex items-center justify-between px-6 ${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
                  style={{
                    clipPath: `polygon(${isFirst ? 0 : clipInset}% 0, ${isFirst ? 100 : 100 - clipInset}% 0, ${100 - clipInset - 2}% 100%, ${clipInset + 2}% 100%)`,
                  }}
                >
                  <span className={`font-semibold ${TEXT_COLORS[colorIdx]} text-sm truncate`}>{step.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransitionPopover({
  fromLabel,
  toLabel,
  conversionRate,
}: {
  fromLabel: string;
  toLabel: string;
  conversionRate: number | null;
}) {
  const rateText = conversionRate != null ? `${conversionRate}%` : "—";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          ↓ {rateText}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm space-y-2">
        <p className="font-semibold">{fromLabel} → {toLabel}</p>
        <p>Taxa de conversão: <span className="font-bold">{rateText}</span></p>
        <p className="text-muted-foreground text-xs">Campanhas: — (disponível após Frente 3)</p>
      </PopoverContent>
    </Popover>
  );
}

export function SalesFunnel() {
  const { selectedStrategyId } = useStrategy();

  const { data: strategy, isLoading } = useQuery({
    queryKey: ["strategy-funnel", selectedStrategyId],
    enabled: !!selectedStrategyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategies")
        .select("id, name, nodes, edges")
        .eq("id", selectedStrategyId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const steps = strategy
    ? processStrategyToSteps(
        strategy.nodes as Array<{ id: string; data?: { label?: string } }>,
        strategy.edges as Array<{ source: string; target: string; data?: { conversionRate?: number } }>
      )
    : [];

  const isDynamic = !!selectedStrategyId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {isDynamic && strategy
            ? `Funil — ${strategy.name}`
            : "Funil de Vendas — Visão Multi-funil"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isDynamic ? (
          <StaticFunnel />
        ) : isLoading ? (
          <FunnelSkeleton />
        ) : steps.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-center">
            <p className="text-muted-foreground text-sm max-w-xs">
              Esta estratégia ainda não tem etapas definidas. Configure no Construtor de Estratégias.
            </p>
          </div>
        ) : (
          <DynamicFunnel steps={steps} />
        )}
      </CardContent>
    </Card>
  );
}
